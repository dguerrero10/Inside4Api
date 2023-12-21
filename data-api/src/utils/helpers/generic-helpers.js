const crypto = require('crypto');

module.exports = {
  capitalizeFirstLetter: (str) => {
    const lowercasedStr = str.toLowerCase();
    return lowercasedStr.charAt(0).toUpperCase() + lowercasedStr.slice(1);
  },

  generateApiKey: () => {
    return crypto.randomBytes(32).toString('base64'); 
  }
};
