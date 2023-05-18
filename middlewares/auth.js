const jwt = require("jsonwebtoken");
const { HTTP_STATUS_CODE } = require("../utils/constants");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .json({ message: "Токен не предоставлен" });
  }

  jwt.verify(token, "JWT_SECRET", (err, payload) => {
    if (err) {
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZE)
        .json({ message: "Недействительный токен" });
    }

    req.user = payload;
    return next();
  });
};

module.exports = authMiddleware;
