const fs = require("fs");
const readline = require("readline");
const { Readable } = require("stream");
const { Helpers } = require("../../util/helpers/helpers");
const { AWSClient } = require("../../util/AWSClient");

module.exports = parseExtractFormIndexes = async (indexFile) => {
  const awsClient = AWSClient.getInstance();
  const helpers = new Helpers();

  try {
    // Create a readable stream
    const fileStream = fs.createReadStream(indexFile);

    // Create a readline interface
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const data = [];

    rl.on("line", (line) => {
      const regex = /^(\S+)\s+(.+?)\s+(\S+)\s+(\S+)\s+(\S+.txt)\s*$/;
      const match = line.match(regex);

      if (match && match[1] === "4") {
        const formType = match[1];
        const companyName = match[2].trim().replace(",", "");  // Trim leading and trailing spaces from the company name as well as remove any commas.
        const CIK = match[3];
        const dateFiled = match[4];
        const url = `https://www.sec.gov/Archives/${match[5]}`;

        data.push({
          formType: formType,
          companyName: companyName,
          CIK: CIK,
          dateFiled: dateFiled,
          url: url,
        });
      }
    });

    // Event listener for the end of the file
    rl.on("close", async () => {
      const csvData =
        "FormType,CompanyName,CIK,DateFiled,URL\n" +
        data
          .map(
            (row) =>
              `${row.formType},${row.companyName},${row.CIK},${row.dateFiled},${row.url}`
          )
          .join("\n");

      console.log("CSV file has been written successfully! Storing in S3...");

      const csvStream = new Readable();
      csvStream.push(csvData);
      csvStream.push(null); // Signal the end of the stream

      const putS3Params = helpers.buildS3PutParams(
        "test",
        "key",
        csvStream,
        "text/csv"
      );
      await awsClient.putS3ObjCMD(putS3Params);
    });
  } catch (error) {
    console.error(error);

    const dynamodbParams = helpers.buildDynamoDBParams(
      Constants.STAGES["2"],
      `Failed to parse index file to csv with url: ${url}`,
      url,
      Constants.STATUS["2"],
      error,
      helpers.getFormattedTimestamp()
    );
    const snsParams = helpers.buildSNSParams(
      "test",
      `Failed to parse index file to csv with url: ${url}`
    );

    await awsClient.storeDataInDynamoDB(dynamodbParams);
    await awsClient.publishMessageToSNS(snsParams);
  }
};
