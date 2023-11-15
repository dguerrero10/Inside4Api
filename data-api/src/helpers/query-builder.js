const { queryStrings, errorMessages } = require("../utils/constants");

const { Validators } = require("../utils/validators");
const { ErrorResponses } = require("../helpers/error-responses");

const validators = new Validators();
const errorResponses = new ErrorResponses();

module.exports = {
  QueryBuilder: class QueryBuilder {
    constructor() {}

    buildQuery(baseQuery, queryParams, res) {
      const buildQueryObj = {
        query: baseQuery,
        hasError: false,
        errorObj: {},
      };

      console.log("Build query obj: ", buildQueryObj);

      if (!Object.keys(queryParams)) {
        return buildQueryObj;
      }

      let startDateObj = null;
      let endDateObj = null;

      if (queryParams.startDate) {
        if (!validators.isStartDateValid(queryParams.startDate)) {
          buildQueryObj.hasError = true;
          buildQueryObj.errorObj = errorResponses.send400Error(
            res,
            errorMessages.invalidStartDate
          );
          return buildQueryObj;
        } else {
          startDateObj = new Date(queryParams.startDate);
        }
      }

      if (queryParams.endDate && !validators.isEndDateValid(queryParams.endDate)) {
        buildQueryObj.hasError = true;
        buildQueryObj.errorObj = errorResponses.send400Error(
          res,
          errorMessages.invalidEndDate
        );
        return buildQueryObj;
      } else {
        endDateObj = queryParams.endDate ? new Date(queryParams.endDate) : new Date();
      }

      if (queryParams.startDate) {
        buildQueryObj.query[queryStrings.transactionDate] = {
          $gte: startDateObj,
        };
      }

      if (queryParams.endDate) {
        buildQueryObj.query[queryStrings.transactionDate] = {
          ...buildQueryObj.query[queryStrings.transactionDate],
          $lte: endDateObj,
        };
      }

      return buildQueryObj;
    }
  },
};
