const { AWSClient } = require("../../util/AWSClient");
const { Constants } = require("../../util/constants");
const { Helpers } = require("../../util/helpers/helpers");
const axios = require("axios");

class IndexFile {
  constructor(quarter = null, year = null) {
    this.quarter = quarter;
    this.year = year;
    this.fileName = `form-index-${this.year}-${this.quarter}.txt`;
    this.url = `https://www.sec.gov/Archives/edgar/full-index/${this.year}/${this.quarter}/form.idx`;
    this.formFiles = [];

    this.file = null;
    this.awsClient = AWSClient.getInstance();
    this.helpers = new Helpers();
  }

  //check if file exists in S3 already
  //Returns: Boolean
  checkIfFileExists = async (prefix) => {
    try {
      // Check if the file is already in S3
      const headS3Params = this.helpers.buildS3HeadParams(
        Constants.BUCKETNAME,
        `${prefix}/${this.fileName}`
      );
      await this.awsClient.headS3ObjectCMD(headS3Params);
      console.log(
        `Skipping index file for ${this.year}, ${this.quarter} because it is already in S3.`
      );
      return true;
    } catch (err) {
      // File doesn't exist in S3, proceed to download and upload
      //console.log("File doesn't exist in S3, proceed to download and upload")
      return false;
    }
  };

  // Downloads txt file from Edgar website
  downloadFormFile = async () => {
    try {
      //Download file
      const response = await axios.get(this.url, { responseType: "stream" });

      //verify no errors
      if (!response.data) {
        throw new Error(`Error: No data in response for ${this.url}`);
      }

      this.file = response.data;

      return 0;
    } catch (error) {
      console.error(error);
      return -1;
    }
  };

  downloadFormFileS3 = async () => {
    try {
      const getS3Params = this.helpers.buildS3GetParams(
        Constants.BUCKETNAME,
        `${Constants.BUCKETKEY}/${this.fileName}`
      );
      return await this.awsClient.getS3ObjCMD(getS3Params);
    } catch (error) {
      console.log(error);
      return -1;
    }
  };

  saveFormFile = async (prefix) => {
    try {
      if (this.file == null) {
        throw new Error(`File data not present for upload:  ${this.url}`);
      }
      //upload file
      const putS3Params = this.helpers.buildS3PutParams(
        Constants.BUCKETNAME,
        `${prefix}/${this.fileName}`,
        this.file
      );
      await this.awsClient.putS3HeadObjCMD(putS3Params);

      console.log(
        `Successfully uploaded index file for ${this.year}, ${this.quarter} to S3.`
      );
    } catch (error) {
      console.log(error);
    }
  };

  saveURLtoDB = async (isSuccess, error) => {
    let dynamodbParams = null;

    if (isSuccess) {
      dynamodbParams = this.helpers.buildDynamoDBParams(
        Constants.STAGES["1"],
        `Successfully stored file with url: ${this.url}`,
        this.url,
        Constants.STATUS["1"],
        "",
        this.helpers.getFormattedTimestamp()
      );
    } else {
      dynamodbParams = this.helpers.buildDynamoDBParams(
        Constants.STAGES["1"],
        `Failed to download index file for ${this.year}, ${this.quarter}`,
        this.url,
        Constants.STATUS["2"],
        error,
        this.helpers.getFormattedTimestamp()
      );

      const snsParams = this.helpers.buildSNSParams(
        "test",
        `Failed to download index file for ${year}, ${quarter}`
      );
      await this.awsClient.publishMessageToSNS(snsParams);
    }

    await this.awsClient.storeDataInDynamoDB(dynamodbParams);
  };
}

module.exports = IndexFile;
