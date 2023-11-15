const express = require("express");
const router = express.Router();

// const checkAuth = require("../middleware/check-auth");

const ownerController = require("../controllers/owner-controller");

router.get("/name/:name", ownerController.getTransactionsByOwner);
router.get("/cik/:cik", ownerController.getTransactionsByOwnerCik);

router.get("/cik/:cik/dates/:startDate/:endDate?", ownerController.getTransactionsByOwnerCikAndDates);
router.get("/name/:name/dates/:startDate/:endDate?", ownerController.getTransactionsByOwnerAndDates);


module.exports = router;
