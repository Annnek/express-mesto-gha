const User = require("../models/user");

// Контроллер для получения списка юзеров
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные пользователя при поиске по id",
        });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({
          message: "Пользователь с данным id не найден",
        });
      }

      return res.status(500).send({ message: "Server error" });
    });
};

// Контроллер для добавления юзера
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные пользователя" });
      }
      console.error(err);
      return res.status(500).send({ message: "Server error" });
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      console.error(err);
      return res.status(500).send({ message: "Server error" });
    });
};

// Контроллер для обновления аватара
const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      console.error(err);
      return res.status(500).send({ message: "Server error" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
