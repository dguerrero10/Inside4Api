const fs = require("fs");
const readline = require("readline");

module.exports = testParse = (indexFile) => {
  indexFile = "./data/form-index-2011-QTR1.txt";
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
        const companyName = match[2].trim().replace(',', ''); // Trim leading and trailing spaces from the company name
        const CIK = match[3];
        const dateFiled = match[4];
        const fileName = match[5];

        const url = `https://www.sec.gov/Archives/${fileName}`;
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

      const localFilePath = "./data/test1.csv";
      // Write the CSV data to a local file
      fs.writeFileSync(localFilePath, csvData);
    });
  } catch (error) {
    console.error(error);
  }
};

testParse();
