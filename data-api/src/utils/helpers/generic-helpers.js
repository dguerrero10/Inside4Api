module.exports = {
  capitalizeFirstLetter: (str) => {
    const lowercasedStr = str.toLowerCase();
    return lowercasedStr.charAt(0).toUpperCase() + lowercasedStr.slice(1);
  },
};
