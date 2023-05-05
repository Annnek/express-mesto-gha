const User = require("../models/user");

// Контроллер для получения списка юзеров
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User is not found" });
      }
      const { name, about, avatar, _id } = user;
      return res.send({ name, about, avatar, _id });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

// Контроллер для добавления юзера
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

// Контроллер для обновления профиля
const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

// Контроллер для обновления аватара
const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
