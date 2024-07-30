const { verify } = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (accessToken) {
    try {
      const validToken = verify(accessToken, process.env.SECRET_KEY);
      req.user = validToken;

      if (validToken) {
        return next();
      }
    } catch (error) {
      res.status(401).json({ message: error.message || "Access Token is invalid or expired. Please Login Again." });
    }
  } else {
    return res.status(401).json({ message: "User not logged in." })
  }
};

module.exports = { validateToken };