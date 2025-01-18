const jwt = require("jsonwebtoken");
const {jwtDecode} = require("jwt-decode");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") return;

  try {
    const {id} = req.params;

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token is missing" });
    }

    let userIdFromToken;

    try {
      const decoded = jwtDecode(token);
      userIdFromToken = decoded.id;
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    if (userIdFromToken !== parseInt(id, 10)) {
      return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
    }

    // const token = req.headers.authorization.split(" ")[1]
    // if (!token) {
    //   return res.status(401).json({message: 'user is not login'})
    // }

    req.user = jwt.verify(token, process.env.SECRET_KEY)
  } catch (e) {
    res.status(401).json({message: 'user is not login'})
  }

  next();
}