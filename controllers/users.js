const User = require("../models/user");
const { HTTP_STATUS_CODE, ERROR_MESSAGE } = require("../utils/constants");

// Контроллер для получения списка юзеров
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_CODE.OK).send(users))
    .catch((err) => {
      console.error(err);
      res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(HTTP_STATUS_CODE.OK).send(user))
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
  const { name, about, avatar } = req.body;
  console.log(req.body);
  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CODE.OK).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: `${ERROR_MESSAGE.BAD_REQUEST} пользователя` });
      }
      console.error(err);
      return res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
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
    .then((user) => res.status(HTTP_STATUS_CODE.OK).send(user))
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
      console.error(err);
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
    .then((user) => res.status(HTTP_STATUS_CODE.OK).send(user))
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
      console.error(err);
      return res
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
};
