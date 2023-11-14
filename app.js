const express = require('express');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');

mongoose.connect("",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection failed')
});
    
app.use(cors());
app.use(express.json());

module.exports = app;