module.exports = downloadIndexFiles = async (startYear = null, endYear = null, isLocal = true) => {
  let IndexFile;
  const delay = 10000;

  if (isLocal) {
    IndexFile = require("../models/IndexFileLocal");
  } else {
    IndexFile = require("../models/IndexFile");
  }

  //if no start year, start at current year
  if (startYear == null) {
    startYear = new Date().getFullYear();
  }

  //if no end year, end 14 years in the past
  if (endYear == null) {
    endYear = new Date().getFullYear() - 14;
  }

  // List of years to be searched.
  const years = Array.from(
    { length: Math.abs(startYear - endYear) },
    (_, i) => endYear - i
  );

  // List of quarters to be searched.
  const quarters = ["QTR1", "QTR2", "QTR3", "QTR4"];

  // Loop over the years and quarters. For each year/quarter combination, get the corresponding
  // index file from EDGAR, and upload it to the specified S3 bucket.
  for (const year of years) {
    for (const quarter of quarters) {
      
      //create indexfile obj
      const myIndexFile = new IndexFile(quarter, year);

      //check if exists
      const doesExist = await myIndexFile.checkFileExists();
      if (doesExist) {
        continue;
      }

      //download file
      const downloadStatus = await myIndexFile.downloadFormFile();
      if (downloadStatus !== 0) {
        await myIndexFile.saveURLtoDB(false, "Failed to download S3 file");
      }

      //store file
      await myIndexFile.saveFormFile();

      //save file url to DB
      await myIndexFile.saveURLtoDB(true);

      // Wait one-tenth of a second before proceeding to the next file.
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

console.log("starting download index files....");
downloadIndexFiles();

module.exports = downloadIndexFiles;
