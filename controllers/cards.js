const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  console.log(req.user._id); // _id станет доступен

  if (!name || !link) {
    return res.status(400).send({ message: "Invalid data" });
  }

  return Card.create({ name, link, owner: ownerId })
    .then((card) => res.send(card))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.send(card);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

const addLikeToCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.send(card);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      return res.send(card);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
};
