const Card = require("../models/card");
const { HTTP_STATUS_CODE, ERROR_MESSAGE } = require("../utils/constants");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(HTTP_STATUS_CODE.SUCCESS).send(cards))
    .catch(() => {
      res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  console.log(req.user._id); // _id станет доступен

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(HTTP_STATUS_CODE.SUCCESS_CREATED).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST}  при создании карточки`,
        });
      }

      return res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user; // Идентификатор текущего пользователя

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} карточка не найдена`,
        });
      }

      // Проверка, что текущий пользователь является владельцем карточки
      if (card.owner.toString() !== userId) {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).send({
          message: "Нет доступа для удаления карточки",
        });
      }

      return Card.findByIdAndRemove(cardId);
    })
    .then((removedCard) => {
      if (!removedCard) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} карточка не найдена`,
        });
      }

      return res.status(HTTP_STATUS_CODE.SUCCESS).send(removedCard);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST} при удалении карточки`,
        });
      } else {
        res.status(HTTP_STATUS_CODE.SERVER_ERROR).send({
          message: ERROR_MESSAGE.SERVER_ERROR,
        });
      }
    });
};

const addLikeToCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(HTTP_STATUS_CODE.SUCCESS).send(card))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} Карточка c указанным id не найдена`,
        });
      }
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST}  для лайка`,
        });
      }

      return res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(HTTP_STATUS_CODE.SUCCESS).send(card))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} карточка c указанным id не найдена`,
        });
      }
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST}  для удаления лайка`,
        });
      }

      return res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: ERROR_MESSAGE.SERVER_ERROR });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
};
