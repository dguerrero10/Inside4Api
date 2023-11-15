exports.healthCheck = async (req, res) => {
    try {
      return res.status(200).json({
        statusCode: 200,
        message: "Api is healthy.",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: err,
        message: "Something went wrong. Please try again later.",
      });
    }
  };
  