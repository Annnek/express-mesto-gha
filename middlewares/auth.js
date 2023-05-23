const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/constants");
const UnauthorizedError = require("../errors/UnauthorizedError");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Вы не зарегистрированы");
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Вам нужно зарегистрироваться"));
  }
  req.user = payload;
  return next();
};

module.exports = authMiddleware;
