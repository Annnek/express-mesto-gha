const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Добавляем модуль bcryptjs для хеширования пароля
const User = require("../models/user");
const { HTTP_STATUS_CODE, ERROR_MESSAGE } = require("../utils/constants");

// Контроллер для получения списка юзеров
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_CODE.SUCCESS).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(HTTP_STATUS_CODE.SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST}  пользователя при поиске по id`,
        });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} пользователь с данным id`,
        });
      } else {
        res
          .status(HTTP_STATUS_CODE.SERVER_ERROR)
          .send({ message: ERROR_MESSAGE.SERVER_ERROR });
      }
      next(err);
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

// Контроллер для добавления юзера
const createUser = (req, res, next) => {
  const {
    name = "Жак-Ив Кусто",
    about = "Исследователь",
    avatar = "ссылка",
    email,
    password,
  } = req.body;
  console.log(req.body);

  // Хеширование пароля
  bcrypt.hash(password, 10, (hashError, hashedPassword) => {
    if (hashError) {
      return next({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: ERROR_MESSAGE.SERVER_ERROR,
      });
    }

    return User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    })
      .then((user) => res.status(HTTP_STATUS_CODE.SUCCESS_CREATED).send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          return next({
            status: HTTP_STATUS_CODE.BAD_REQUEST,
            message: `${ERROR_MESSAGE.BAD_REQUEST} пользователя`,
          });
        }
        return next(err);
      });
  });
};

// Контроллер для обновления профиля
const updateProfile = (req, res, next) => {
  const userId = req.user._id;
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
  const userId = req.user._id;
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

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return next({
          status: HTTP_STATUS_CODE.UNAUTHORIZED,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      // Проверка соответствия пароля
      return bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return next({
            status: HTTP_STATUS_CODE.UNAUTHORIZED,
            message: ERROR_MESSAGE.UNAUTHORIZED,
          });
        }

        const payload = {
          _id: user._id,
        };

        const token = jwt.sign(payload, "JWT_SECRET", { expiresIn: "7d" });

        return res.status(HTTP_STATUS_CODE.SUCCESS).send({ token });
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
