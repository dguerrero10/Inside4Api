const FormFourModel = require("../models/form-four");
const { queryStrings } = require("../utils/constants");

exports.getTransactionsByOwner = async (req, res) => {
  const { name } = req.params;

  try {
    const baseQuery = {
      [queryStrings.ownerName]: { $regex: new RegExp(name.toUpperCase(), "i") },
    };

    const queryFields = queryBuilder.buildQuery(baseQuery, req.query, res);

    if (queryFields.hasError) {
      return queryFields.errorObj;
    }

    const results = await FormFourModel.find(queryFields.query).sort({
      [queryStrings.transactionDate]: -1,
    });

    return res.status(200).json({
      results: results,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.getTransactionsByOwnerCik = async (req, res) => {
  const { cik } = req.params;

  try {
    const baseQuery = {
      [queryStrings.ownerCik]: cik,
    };

    const queryFields = queryBuilder.buildQuery(baseQuery, req.query, res);

    if (queryFields.hasError) {
      return queryFields.errorObj;
    }

    const results = await FormFourModel.find(queryFields.query).sort({
      [queryStrings.transactionDate]: -1,
    });

    return res.status(200).json({
      results: results,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
      message: "Something went wrong. Please try again later.",
    });
  }
};
