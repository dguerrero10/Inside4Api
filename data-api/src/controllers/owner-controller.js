const FormFourModel = require("../models/form-four");
const { queryStrings, errorMessages } = require("../utils/constants");

const { Validators } = require("../utils/validators");
const { ErrorResponses } = require("../helpers/error-responses");

const validators = new Validators();
const errorResponses = new ErrorResponses();

exports.getTransactionsByOwner = async (req, res) => {
  const { name } = req.params;

  try {
    const results = await FormFourModel.find({
      [queryStrings.ownerName]: { $regex: new RegExp(name.toUpperCase(), "i") },
    }).sort({ [queryStrings.transactionDate]: -1 });

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

exports.getTransactionsByOwnerAndDates = async (req, res) => {
  const { name, startDate, endDate } = req.params;

  try {
    let startDateObj = null;
    let endDateObj = null;

    if (!validators.isStartDateValid(startDate)) {
      return errorResponses.return400Error(res, errorMessages.invalidStartDate);
    } else {
      startDateObj = new Date(startDate);
    }

    if (endDate && !validators.isEndDateValid(endDate)) {
      return errorResponses.return400Error(res, errorMessages.invalidStartDate);
    } else {
      endDateObj = endDate ? new Date(endDate) : new Date();
    }
    const results = await FormFourModel.find({
      [queryStrings.ownerName]: name,
      [queryStrings.transactionDate]: { $gte: startDateObj, $lte: endDateObj },
    }).sort({ [queryStrings.transactionDate]: -1 });

    res.status(200).json({
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
    const results = await FormFourModel.find({
      [queryStrings.ownerCik]: cik,
    }).sort({ [queryStrings.transactionDate]: -1 });

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

exports.getTransactionsByOwnerCikAndDates = async (req, res) => {
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
      return errorResponses.return400Error(res, errorMessages.invalidStartDate);
    } else {
      endDateObj = endDate ? new Date(endDate) : new Date();
    }

    const results = await FormFourModel.find({
      [queryStrings.ownerCik]: cik,
      [queryStrings.transactionDate]: { $gte: startDateObj, $lte: endDateObj },
    }).sort({ [queryStrings.transactionDate]: -1 });

    res.status(200).json({
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
