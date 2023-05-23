const jwt = require("jsonwebtoken");
const { HTTP_STATUS_CODE, JWT_SECRET } = require("../utils/constants");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next({ status: HTTP_STATUS_CODE.UNAUTHORIZED });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next({ status: HTTP_STATUS_CODE.UNAUTHORIZED });
  }
  req.user = payload;
  return next();
};

module.exports = authMiddleware;
