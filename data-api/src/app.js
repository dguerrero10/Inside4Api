const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");

const healthCheckRoutes = require("./routes/health-check-routes");
const companyRoutes = require("./routes/company-routes");
const ownerRoutes = require("./routes/owner-routes");

require('dotenv').config();

mongoose
  .connect(process.env.DB_CONNECTION_STRING_TEST,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection failed");
  });

app.use(cors());
app.use(express.json());
app.use("/api/health", healthCheckRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/owner", ownerRoutes);

module.exports = app;
