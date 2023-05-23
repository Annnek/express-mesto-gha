const errorHandler = (error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message:
      statusCode === 500
        ? "На сервере произошла ошибка, попробуйте позже"
        : message,
  });
  next();
};

module.exports = errorHandler;
