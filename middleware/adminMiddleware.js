const jwt = require("jsonwebtoken");
const {jwtDecode} = require("jwt-decode");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    const userRole = jwtDecode(token).role;

    if (userRole !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized: Permission denied" });
    }

  } catch (e) {
    res.status(401).json({message: 'Unauthorized: Permission denied'})
  }

  next();
}