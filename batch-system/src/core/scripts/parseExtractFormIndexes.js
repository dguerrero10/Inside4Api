
const { IndexFileParser } = require('../models/IndexFileParser')

module.exports = parseExtractFormIndexes = async (indexFile) => {

  const indexFileParser = new IndexFileParser(indexFile)


  try {

    await indexFileParser.parseFile()
    await indexFileParser.saveStateToDB(true)


  } catch (error) {
    console.error(error);
    await indexFileParser.saveStateToDB(false, "Error parsing file")
  }
};
