const express = require("express");
const router = express.Router();

// const checkAuth = require("../middleware/check-auth");

const healthCheckController = require("../controllers/health-check-controller");

router.get("", healthCheckController.healthCheck);

module.exports = router;
