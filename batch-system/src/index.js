const downloadIndexFiles = require("./core/scripts/downloadIndexFiles");

exports.index = async (event, context) => {
  try {
    downloadIndexFiles(null, null, false);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
