module.exports = {
    queryStrings: {
        "ticker": "issuer.issuerTradingSymbol",
        "issuerCik": "issuer.issuerCik",
        "ownerCik": "reportingOwner.reportingOwnerId.rptOwnerCik",
        "transactionDate": "nonDerivativeTable.nonDerivativeTransaction.transactionDate.value",
        "ownerName": "reportingOwner.reportingOwnerId.rptOwnerName",
        "transactionCodeNonDerivative": "nonDerivativeTable.nonDerivativeTransaction.transactionCoding.transactionCode",
        "ownerRelationship": "reportingOwner.reportingOwnerRelationship.is",
        "transactionSharesNonDerivative": "nonDerivativeTable.nonDerivativeTransaction.transactionAmounts.transactionShares.value"
    },
    errorMessages: {
        "invalidEndDate": "End date is invalid. It must be in the format (YYYY-MM-DD) and not greater than today.",
        "invalidStartDate": "Start date is invalid. It must be in the format (YYYY-MM-DD) and not greater than today.",
        "startDateGreaterThanEndDate": "Start date cannot be greater than end date."
    },
}