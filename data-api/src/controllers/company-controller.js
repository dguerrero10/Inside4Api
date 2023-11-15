const FormFourModel = require("../models/form-four");
const { queryStrings, errorMessages } = require("../utils/constants");

const { Validators } = require("../utils/validators");
const { ErrorResponses } = require("../helpers/error-responses");

const validators = new Validators();
const errorResponses = new ErrorResponses();

exports.getTransactionsByCompanyTicker = async (req, res) => {
  const { ticker } = req.params;

  try {
    const results = await FormFourModel.find({
      [queryStrings.ticker]: ticker.toUpperCase(),
    }).sort({ [queryStrings.transactionDate]: -1 });

    return res.status(200).json({
      results: results,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.getTransactionsByCompanyTickerAndDates = async (req, res) => {
  const { ticker, startDate, endDate } = req.params;

  try {
    let startDateObj = null;
    let endDateObj = null;

    if (!validators.isStartDateValid(startDate)) {
      return errorResponses.return400Error(res, errorMessages.invalidStartDate);
    } else {
      startDateObj = new Date(startDate);
    }

    if (endDate && !validators.isEndDateValid(endDate)) {
      return errorResponses.return400Error(res, errorMessages.invalidEndDate);
    } else {
      endDateObj = endDate ? new Date(endDate) : new Date();
    }

    const results = await FormFourModel.find({
      [queryStrings.ticker]: ticker.toUpperCase(),
      [queryStrings.transactionDate]: { $gte: startDateObj, $lte: endDateObj },
    }).sort({ [queryStrings.transactionDate]: -1 });

    res.status(200).json({
      results: results,
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
    const results = await FormFourModel.find({
      [queryStrings.issuerCik]: cik,
    }).sort({ [queryStrings.transactionDate]: -1 });

    return res.status(200).json({
      results: results,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.getTransactionsByCompanyCikAndDates = async (req, res) => {
  const { cik, startDate, endDate } = req.params;

  try {
    let startDateObj = null;
    let endDateObj = null;
    
    if (!validators.isStartDateValid(startDate)) {
      return errorResponses.return400Error(res, errorMessages.invalidStartDate);
    } else {
      startDateObj = new Date(startDate);
    }

    if (endDate && !validators.isEndDateValid(endDate)) {
      return errorResponses.return400Error(res, errorMessages.invalidEndDate);
    } else {
      endDateObj = endDate ? new Date(endDate) : new Date();
    }

    const results = await FormFourModel.find({
      [queryStrings.issuerCik]: cik,
      [queryStrings.transactionDate]: { $gte: startDateObj, $lte: endDateObj },
    }).sort({ [queryStrings.transactionDate]: -1 });

    return res.status(200).json({
      results: results,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
