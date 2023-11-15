module.exports = {
    queryStrings: {
        "ticker": "issuer.issuerTradingSymbol",
        "issuerCik": "issuer.issuerCik",
        "ownerCik": "reportingOwner.reportingOwnerId.rptOwnerCik",
        "transactionDate": "nonDerivativeTable.nonDerivativeTransaction.transactionDate",
        "ownerName": "reportingOwner.reportingOwnerId.rptOwnerName"
    },
    errorMessages: {
        "invalidEndDate": "End date is invalid. It must be in the format (YYYY-MM-DD) and not greater than today.",
        "invalidStartDate": "Start date is invalid. It must be in the format (YYYY-MM-DD) and not greater than today."
    }
}