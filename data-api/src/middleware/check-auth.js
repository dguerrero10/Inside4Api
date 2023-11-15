// const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // const decodedToken = jwt.verify(
    //   token,
    //   '890CF9D3EDC930AE736157056C6DFE13443AA632FCDA457E86289B46F0FC6C02'
    // );
    // req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};
