const { queryStrings, errorMessages } = require("../constants");

const { Validators } = require("./validators");
const { ErrorResponses } = require("./error-responses");
const { capitalizeFirstLetter } = require("./generic-helpers");

const validators = new Validators();
const errorResponses = new ErrorResponses();

module.exports = {
  QueryBuilder: class QueryBuilder {
    constructor() { }

    buildQuery(baseQuery, queryParams, res) {
      const buildQueryObj = {
        query: baseQuery,
        hasError: false,
        errorObj: {},
      };

      if (!queryParams || !Object.keys(queryParams)) {
        return buildQueryObj;
      }

      if (queryParams.startDate) {
        if (!validators.isStartDateValid(queryParams.startDate)) {
          buildQueryObj.hasError = true;
          buildQueryObj.errorObj = errorResponses.send400Error(
            res,
            errorMessages.invalidStartDate
          );
          return buildQueryObj;
        } else {
          buildQueryObj.query[queryStrings.transactionDate] = {
            $gte: new Date(queryParams.startDate)
          };
        }
      }

      if (queryParams.endDate && !validators.isEndDateValid(queryParams.endDate)) {
        buildQueryObj.hasError = true;
        buildQueryObj.errorObj = errorResponses.send400Error(res, errorMessages.invalidEndDate);
        return buildQueryObj;
      } else {
        buildQueryObj.query[queryStrings.transactionDate] = {
          ...buildQueryObj.query[queryStrings.transactionDate],
          $lte: queryParams.endDate ? new Date(queryParams.endDate) : new Date()
        };
      }

      if (queryParams.transactionCode) {
        buildQueryObj.query[queryStrings.transactionCodeNonDerivative] = {
          $eq: queryParams.transactionCode.toUpperCase(),
        };
      }

      if (queryParams.relationship) {
        let standardizedRelationshipStr = null;

        if (queryParams.relationship.toLowerCase() === "tenpercentowner") {
          standardizedRelationshipStr = "TenPercentOwner";
        } else {
          standardizedRelationshipStr = capitalizeFirstLetter(queryParams.relationship);
        }
        buildQueryObj.query[queryStrings.ownerRelationship + standardizedRelationshipStr.trim()] = {
          $eq: true
        }
      }

      return buildQueryObj;
    }
  },
};
