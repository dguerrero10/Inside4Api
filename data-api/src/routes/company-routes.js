const express = require("express");
const router = express.Router();

// const checkAuth = require("../middleware/check-auth");

const companyController = require("../controllers/company-controller");

router.get("/ticker/:ticker", companyController.getTransactionsByCompanyTicker);
router.get("/cik/:cik", companyController.getTransactionsByCompanyCik);

module.exports = router;
