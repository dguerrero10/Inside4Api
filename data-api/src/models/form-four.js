const mongoose = require("mongoose");

const formFourSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  schemaVersion: { type: String },
  documentType: { type: Number },
  periodOfReport: { type: Date },
  notSubjectToSection16: { type: Boolean },
  issuer: {
    issuerCik: { type: Number },
    issuerName: { type: String },
    issuerTradingSymbol: { type: String },
  },
  reportingOwner: {
    reportingOwnerId: {
      rptOwnerCik: { type: Number },
      rptOwnerName: { type: String },
    },
    reportingOwnerAddress: {
      rptOwnerStreet1: { type: String },
      rptOwnerStreet2: { type: String },
      rptOwnerCity: { type: String },
      rptOwnerState: { type: String },
      rptOwnerZipCode: { type: String },
      rptOwnerStateDescription: { type: String },
    },
    reportingOwnerRelationship: {
      isDirector: { type: Boolean },
      isOfficer: { type: Boolean },
      isTenPercentOwner: { type: Boolean },
      isOther: { type: Boolean },
      officerTitle: { type: String },
      otherText: { type: String },
    },
    nonDerivativeTable: {
      nonDerivativeTransaction: {
        securityTitle: { value: { type: String } },
        transactionDate: { value: { type: Date } },
        deemedExecutionDate: { type: Date },
        transactionCoding: {
          transactionFormType: { type: Number },
          transactionCode: { type: String },
          equitySwapInvolved: { type: Boolean },
        },
        transactionTimeliness: { type: String },
        transactionAmounts: {
          transactionShares: {
            value: { type: Number },
            footnoteId: { type: String },
          },
          transactionPricePerShare: { value: { type: Number } },
          transactionAcquiredDisposedCode: { value: { type: String } },
        },
        postTransactionAmounts: {
          sharesOwnedFollowingTransaction: {
            value: { type: Number },
          },
        },
        ownershipNature: {
          directOrIndirectOwnership: {
            value: { type: String },
          },
        },
      },
    },
    derivativeTable: {
      derivativeTransaction: {
        securityTitle: {
          value: { type: String },
        },
        conversionOrExercisePrice: {
          footnoteId: { type: String },
        },
        transactionDate: {
          value: { type: Date },
        },
        deemedExecutionDate: { type: Date },
        transactionCoding: {
          transactionFormType: { type: Number },
          transactionCode: { type: String },
          equitySwapInvolved: { type: Boolean },
        },
        transactionTimeliness: { type: String },
        transactionAmounts: {
          transactionShares: {
            value: { type: Number },
          },
          transactionPricePerShare: {
            value: { type: Number },
          },
          transactionAcquiredDisposedCode: {
            value: { type: String },
          },
        },
        exerciseDate: {
          footnoteId: { type: String },
        },
        expirationDate: {
          footnoteId: { type: String },
        },
        underlyingSecurity: {
          underlyingSecurityTitle: {
            value: { type: String },
          },
          underlyingSecurityShares: {
            value: { type: Number },
          },
        },
        postTransactionAmounts: {
          sharesOwnedFollowingTransaction: {
            value: { type: Number },
          },
        },
        ownershipNature: {
          directOrIndirectOwnership: {
            value: { type: String },
          },
        },
      },
    },
    footnotes: {
      footnote: { type: Array },
    },
    remarks: { type: String },
    ownerSignature: {
      signatureName: { type: String },
      signatureDate: { type: String },
    },
  },
});

module.exports = mongoose.model("FormFour", formFourSchema, "formFours");
