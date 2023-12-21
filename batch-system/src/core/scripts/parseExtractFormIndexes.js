const { IndexFileParser } = require("../models/IndexFileParser");

module.exports = parseExtractFormIndexes = async (indexFile) => {
  const indexFileParser = new IndexFileParser(indexFile);

  try {
    const formFile = await indexFileParser.parseFile();
    await indexFileParser.saveStateToDB(true);
    //do something with form file data
    console.log("I have a form file");
    console.log(formFile);
  } catch (error) {
    console.error(error);
    await indexFileParser.saveStateToDB(false, "Error parsing form file");
  }
};
