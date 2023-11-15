const express = require("express");
const router = express.Router();

// const checkAuth = require("../middleware/check-auth");

const ownerController = require("../controllers/owner-controller");

router.get("/name/:name", ownerController.getTransactionsByOwner);
router.get("/cik/:cik", ownerController.getTransactionsByOwnerCik);

module.exports = router;
