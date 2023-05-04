const User = require("../models/user");

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
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

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

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
