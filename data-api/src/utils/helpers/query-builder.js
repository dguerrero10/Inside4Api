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
      console.log(queryParams)
      let buildQueryObj = {
        query: baseQuery,
        hasError: false,
        errorObj: {},
      };
    
      if (!queryParams || !Object.keys(queryParams)) {
        return buildQueryObj;
      }
    
      let startDateObj = null;
      let endDateObj = null;

      const conditions = [];
    
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
          conditions.push({
            [queryStrings.transactionDate]: {
              $gte: startDateObj.toISOString(),
            },
          });
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
        conditions.push({
          [queryStrings.transactionDate]: {
            $lte: endDateObj.toISOString(),
          },
        });
      }

      if (conditions.length === 2 && startDateObj > endDateObj) {
        buildQueryObj.hasError = true;
        buildQueryObj.errorObj = errorResponses.send400Error(
          res,
          errorMessages.startDateGreaterThanEndDate
        );
        return buildQueryObj;
      }
    
      if (queryParams.transactionCode) {
        conditions.push({
          [queryStrings.transactionCodeNonDerivative]: {
            $eq: queryParams.transactionCode.toUpperCase(),
          },
        });
      }
    
      if (queryParams.relationship) {
        let standardizedRelationshipStr = null;
    
        if (queryParams.relationship.toLowerCase() === "tenpercentowner") {
          standardizedRelationshipStr = "TenPercentOwner";
        } else {
          standardizedRelationshipStr = capitalizeFirstLetter(queryParams.relationship);
        }
    
        conditions.push({
          [queryStrings.ownerRelationship + standardizedRelationshipStr.trim()]: {
            $eq: true,
          },
        });
      }
    
      if (queryParams.transactionShares) {
        conditions.push({
          [queryStrings.transactionSharesNonDerivative]: {
            $gte: parseInt(queryParams.transactionShares),
          },
        });
      }
    
      if (conditions.length > 0) {
        buildQueryObj.query.$and = conditions;
      }
      console.log(conditions)
      return buildQueryObj;
    }    
  },
};
