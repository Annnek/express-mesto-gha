const bcrypt = require("bcryptjs"); // Добавляем модуль bcryptjs для хеширования пароля
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  HTTP_STATUS_CODE,
  ERROR_MESSAGE,
  JWT_SECRET,
} = require("../utils/constants");

// Контроллер для регистрации юзера
function registrationUser(req, res, next) {
  const { email, password, name, about, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      }),
    )
    .then((user) => {
      const { _id } = user;

      return res.status(HTTP_STATUS_CODE.SUCCESS_CREATED).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next({
          status: HTTP_STATUS_CODE.CONFLICT_ERR0R,
          message: ERROR_MESSAGE.CONFLICT_ERR0R,
        });
      } else if (err.name === "ValidationError") {
        next({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: ERROR_MESSAGE.BAD_REQUEST,
        });
      } else {
        next(err);
      }
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.send({ _id: token });
      }

      return next({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        message: ERROR_MESSAGE.UNAUTHORIZED,
      });
    })
    .catch(next);
}

// Контроллер для получения списка юзеров
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_CODE.SUCCESS).send(users))
    .catch(next);
};

// Контроллер для получения юзера по id
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(HTTP_STATUS_CODE.SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST}  пользователя при поиске по id`,
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} пользователь с данным id`,
        });
      }
      return next(err);
    });
};

// Контроллер для получения информации о пользователе
function getUserInfo(req, res, next) {
  const { userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} - Пользователь с таким id не найден`,
        });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST} - Передан некорректный id`,
        });
      } else {
        next(err);
      }
    });
}

// Контроллер для обновления профиля
const updateProfile = (req, res, next) => {
  const { userId } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(HTTP_STATUS_CODE.SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: `${ERROR_MESSAGE.BAD_REQUEST} для обновления профиля`,
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return next({
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: `${ERROR_MESSAGE.NOT_FOUND} пользователь не найден`,
        });
      }
      return next(err);
    });
};

// Контроллер для обновления аватара
const updateAvatar = (req, res, next) => {
  const { userId } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_CODE.SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: `${ERROR_MESSAGE.BAD_REQUEST} для обновления аватара`,
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return next({
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: `${ERROR_MESSAGE.NOT_FOUND} пользователь не найден`,
        });
      }
      return next(err);
    });
};

module.exports = {
  registrationUser,
  loginUser,
  getUsers,
  getUserById,
  getUserInfo,
  updateProfile,
  updateAvatar,
};
