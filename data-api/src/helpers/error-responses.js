module.exports = {
    ErrorResponses: class ErrorResponses {
      constructor() {}
      
      return400Error(res, message) {
        return res.status(400).json({
          error: "Bad request.",
          message: message
        });
      }
    },
};
  