const express = require("express");
const router = express.Router();

// const checkAuth = require("../middleware/check-auth");

const companyController = require("../controllers/company-controller");

router.get("/ticker/:ticker", companyController.getTransactionsByCompanyTicker);
router.get("/cik/:cik", companyController.getTransactionsByCompanyCik);

router.get("/ticker/:ticker/dates/:startDate/:endDate?", companyController.getTransactionsByCompanyTickerAndDates);
router.get("/cik/:cik/dates/:startDate/:endDate?", companyController.getTransactionsByCompanyCikAndDates);

module.exports = router;
