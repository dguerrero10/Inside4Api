const downloadIndexFiles = require("./downloadIndexFiles");

module.exports = slsDownloadIndexFiles = async (event) => {
  let start = null;
  let end = null;

  if (event.queryStringParameters?.startYear) {
    if (typeof event.queryStringParameters.startYear !== "number") {
      throw new Error("Invalid type of start year. Expecting Number");
    }
    if (event.queryStringParameters.startYear < 2000) {
      throw new Error(
        "Invalid value of start year. Expecting more recent year"
      );
    }
    if (event.queryStringParameters.startYear > new Date().getFullYear()) {
      throw new Error(
        "Invalid value of start year. Expecting start date before or equal to current date"
      );
    }

    start = event.queryStringParameters.startYear;
  }

  if (event.queryStringParameters?.endYear) {
    if (typeof event.queryStringParameters.endYear !== "number") {
      throw new Error("Invalid type of end year. Expecting Number");
    }
    if (event.queryStringParameters.endYear < 2000) {
      throw new Error("Invalid value of end year. Expecting more recent year");
    }
    if (event.queryStringParameters.endYear > new Date().getFullYear()) {
      throw new Error(
        "Invalid value of end year. Expecting end date before or equal to current date"
      );
    }

    end = event.queryParameters.endYear;
  }

  await downloadIndexFiles(start, end, false);
};

module.exports = slsDownloadFormFiles = (event) => {};
