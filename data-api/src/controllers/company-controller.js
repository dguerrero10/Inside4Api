const FormFourModel = require("../models/form-four");
const { queryStrings } = require("../utils/constants");
const { QueryBuilder } = require("../utils/helpers/query-builder");
const queryBuilder = new QueryBuilder();

exports.getTransactionsByCompanyTicker = async (req, res) => {
  const { ticker } = req.params;

  try {
    const baseQuery = {
      [queryStrings.ticker]: ticker.toUpperCase(),
    };

    const queryFields = queryBuilder.buildQuery(baseQuery, req.query, res);

    if (queryFields.hasError) {
      return queryFields.errorObj;
    }

    console.log("queryFields", queryFields);

    const results = await FormFourModel.find(queryFields.query).sort({
      [queryStrings.transactionDate]: -1,
    });

    const numberOfFilingsFound = results && results.length ? results.length : 0;

    return res.status(200).json({
      numberOfFilingsFound,
      results
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.getTransactionsByCompanyCik = async (req, res) => {
  const { cik } = req.params;

  try {
    const baseQuery = {
      [queryStrings.issuerCik]: cik,
    };

    const queryFields = queryBuilder.buildQuery(baseQuery, req.query, res);

    if (queryFields.hasError) {
      return queryFields.errorObj;
    }

    const results = await FormFourModel.find(queryFields.query).sort({
      [queryStrings.transactionDate]: -1,
    });

    const numberOfFilingsFound = results && results.length ? results.length : 0;

    return res.status(200).json({
      numberOfFilingsFound,
      results
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
