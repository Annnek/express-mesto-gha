const HTTP_STATUS_CODE = {
  SUCCESS: 200,
  SUCCESS_CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const ERROR_MESSAGE = {
  BAD_REQUEST: "Переданы некорректные данные",
  UNAUTHORIZED: "Неправильная почта или пароль",
  NOT_FOUND: "Запрашиваемые данные не найдены",
  SERVER_ERROR: "Ошибка на сервере",
};

module.exports = { HTTP_STATUS_CODE, ERROR_MESSAGE };
