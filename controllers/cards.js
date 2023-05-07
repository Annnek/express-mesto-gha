const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  console.log(req.user._id); // _id станет доступен

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
      console.error(err);
      return res.status(500).send({ message: "Server error" });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при удалении карточки",
        });
      }
      console.error(err);
      return res.status(500).send({ message: "Server error" });
    });
};

const addLikeToCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Карточка c указанным id не найдена" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы неправильные данные для лайка.",
        });
      }
      console.error(err);
      return res.status(500).send({ message: "Server error" });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Карточка c указанным id не найдена" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы неправильные данные для удаления лайка.",
        });
      }
      console.error(err);
      return res.status(500).send({ message: "Server error" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
};
