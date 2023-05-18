const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Добавляем модуль bcryptjs для хеширования пароля
const User = require("../models/user");
const { HTTP_STATUS_CODE, ERROR_MESSAGE } = require("../utils/constants");

// Контроллер для получения списка юзеров
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_CODE.SUCCESS).send(users))
    .catch(() => {
      res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

const getUserById = (req, res) => {
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
      return res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

// Контроллер для добавления юзера
const createUser = (req, res) => {
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
      return res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
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
          return res
            .status(HTTP_STATUS_CODE.BAD_REQUEST)
            .send({ message: `${ERROR_MESSAGE.BAD_REQUEST} пользователя` });
        }
        return res
          .status(HTTP_STATUS_CODE.SERVER_ERROR)
          .send({ message: ERROR_MESSAGE.SERVER_ERROR });
      });
  });
};

// Контроллер для обновления профиля
const updateProfile = (req, res) => {
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
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST} для обновления профиля`,
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} пользователь не найден`,
        });
      }
      return res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

// Контроллер для обновления аватара
const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_CODE.SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST} для обновления аватара`,
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} пользователь не найден`,
        });
      }

      return res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res
          .status(HTTP_STATUS_CODE.UNAUTHORIZED)
          .send({ message: ERROR_MESSAGE.UNAUTHORIZED });
      }

      const payload = {
        _id: user._id,
      };

      const token = jwt.sign(payload, "JWT_SECRET", { expiresIn: "7d" });

      return res.status(HTTP_STATUS_CODE.SUCCESS).send({ token });
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
