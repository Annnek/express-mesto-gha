// const HTTP_STATUS_CODE = {
//   SUCCESS: 200,
//   SUCCESS_CREATED: 201,
//   BAD_REQUEST: 400,
//   UNAUTHORIZED: 401,
//   FORBIDDEN: 403,
//   NOT_FOUND: 404,
//   CONFLICT_ERR0R: 409,
//   SERVER_ERROR: 500,
// };

// const ERROR_MESSAGE = {
//   BAD_REQUEST: "Переданы некорректные данные",
//   UNAUTHORIZED: "Неправильная почта или пароль",
//   NOT_FOUND: "Запрашиваемые данные не найдены",
//   CONFLICT_ERR0R:
//     "Пользователь с таким электронным адресом уже зарегистрирован",
//   SERVER_ERROR: "Ошибка на сервере",
// };

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const JWT_SECRET = "my-secret-password";

module.exports = {
  URL_REGEX,
  JWT_SECRET,
};
