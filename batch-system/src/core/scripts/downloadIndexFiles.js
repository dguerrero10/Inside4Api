const axios = require("axios");
const { AWSClient } = require("../../util/AWSClient");
const { Helpers } = require("../../util/helpers/helpers");
const { Constants } = require("../../util/constants");


module.exports = downloadIndexFiles = async () => {
  const awsClient = AWSClient.getInstance();
  const helpers = new Helpers();

  // Get current year.
  const currentYear = new Date().getFullYear();
  
  // List of years to be searched.
  const years = Array.from({ length: 14 }, (_, i) => currentYear - i);

  // List of quarters to be searched.
  const quarters = ["QTR1", "QTR2", "QTR3", "QTR4"];

  // The name of your S3 bucket
  const bucketName = "S3_BUCKET_NAME";

  const urlsStored = [];
  // Loop over the years and quarters. For each year/quarter combination, get the corresponding
  // index file from EDGAR, and upload it to the specified S3 bucket.
  for (const year of years) {
    for (const quarter of quarters) {
      const fileName = `form-index-${year}-${quarter}.txt`;

      try {
        // Check if the file is already in S3
        const headS3Params = helpers.buildS3HeadParams(bucketName, `edgar/${year}/${fileName}`);
        await awsClient.headS3ObjectCMD(headS3Params);
        console.log(`Skipping index file for ${year}, ${quarter} because it is already in S3.`);
        continue;
      } catch (err) {
        // File doesn't exist in S3, proceed to download and upload
      }

      // Define the URL at which to get the index file.
      const url = `https://www.sec.gov/Archives/edgar/full-index/${year}/${quarter}/form.idx`;

      // Download the file
      const response = await axios.get(url, { responseType: "stream" });

      try {
        if (!response.data) {
          throw new Error(`Error: No data in response for ${url}`);
        }
        
        const putS3Params = helpers.buildS3PutParams(bucketName, s3Key, response.data);
        await awsClient.putS3HeadObjCMD(putS3Params);

        console.log(`Successfully uploaded index file for ${year}, ${quarter} to S3.`);

        urlsStored.push(url);
      } catch (error) {
        console.error(error);

        const dynamodbParams = helpers.buildDynamoDBParams(
          Constants.STAGES["1"], 
          `Failed to download index file for ${year}, ${quarter}`,
          url,
          Constants.STATUS["2"],
          error,
          helpers.getFormattedTimestamp()
          );
        const snsParams = helpers.buildSNSParams("test", `Failed to download index file for ${year}, ${quarter}`);

        await awsClient.storeDataInDynamoDB(dynamodbParams);
        await awsClient.publishMessageToSNS(snsParams);
          
      }
      // Wait one-tenth of a second before proceeding to the next file.
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  for (const url of urlsStored) {
    const dynamodbParams = helpers.buildDynamoDBParams(
      Constants.STAGES["1"], 
      `Successfully stored file with url: ${url}`,
      url,
      Constants.STATUS["1"],
      "",
      helpers.getFormattedTimestamp()
      );
      await awsClient.storeDataInDynamoDB(dynamodbParams);
  }
};
