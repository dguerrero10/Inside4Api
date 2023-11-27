const fs = require("fs");
const readline = require("readline");
const { Readable } = require("stream");
const { Helpers } = require("../../util/helpers/helpers");
const { AWSClient } = require("../../util/AWSClient");
const { Constants } = require("../../util/constants");

class IndexFileParser {
    constructor( filename ) {
        this.filename = filename
        this.data = null 
        this.awsClient = AWSClient.getInstance();
        this.helpers = new Helpers();
    }

    parseFile = () => {
        // Create a readable stream
        const fileStream = fs.createReadStream(indexFile);

        // Create a readline interface
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });


        rl.on("line", (line) => this.lineHandler(line))

        rl.on("close", async () => this.closeHandler())
    }

    lineHandler = (line) => {
        const regex = /^(\S+)\s+(.+?)\s+(\S+)\s+(\S+)\s+(\S+.txt)\s*$/;
        const match = line.match(regex);
  
        if (match && match[1] === "4") {
          const formType = match[1];
          const companyName = match[2].trim().replace(",", "");  // Trim leading and trailing spaces from the company name as well as remove any commas.
          const CIK = match[3];
          const dateFiled = match[4];
          const url = `https://www.sec.gov/Archives/${match[5]}`;
  
          this.data.push({
            formType: formType,
            companyName: companyName,
            CIK: CIK,
            dateFiled: dateFiled,
            url: url,
          })
        }
    }

    closeHandler = async () => {
        const csvData =
        "FormType,CompanyName,CIK,DateFiled,URL\n" +
        this.data.map(
            (row) =>
              `${row.formType},${row.companyName},${row.CIK},${row.dateFiled},${row.url}`
        )
        .join("\n");

        console.log("CSV file has been written successfully! Storing in S3...");

        this.uploadCSVToS3(csvData)
    }

    uploadCSVToS3 = async (csvData) => {
        const csvStream = new Readable();
        csvStream.push(csvData);
        csvStream.push(null); // Signal the end of the stream

        const putS3Params = this.helpers.buildS3PutParams(
            "test",
            "key",
            csvStream,
            "text/csv"
        );
        await this.awsClient.putS3ObjCMD(putS3Params);
    }

    saveStateToDB = async (isSuccess, error) => {
        let dynamodbParams = null

        if(isSuccess){
            dynamodbParams = this.helpers.buildDynamoDBParams(
                Constants.STAGES["2"],
                `Successfully parsed index file to csv with name: ${downloadStatus}`,
                url,
                Constants.STATUS["2"],
                error,
                this.helpers.getFormattedTimestamp()
            );
        }
        else{
            dynamodbParams = this.helpers.buildDynamoDBParams(
                Constants.STAGES["2"],
                `Failed to parse index file to csv with name: ${downloadStatus}`,
                url,
                Constants.STATUS["2"],
                error,
                this.helpers.getFormattedTimestamp()
            );

            const snsParams = this.helpers.buildSNSParams(
                "test",
                `Failed to parse index file to csv with url: ${url}`
              );
            await this.awsClient.publishMessageToSNS(snsParams);
        }
      

        await this.awsClient.storeDataInDynamoDB(dynamodbParams);
    }

}

module.exports = IndexFileParser