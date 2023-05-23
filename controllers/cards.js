const Card = require("../models/card");
const { HTTP_STATUS_CODE, ERROR_MESSAGE } = require("../utils/constants");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(HTTP_STATUS_CODE.SUCCESS).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { userId } = req.user;
  console.log(req.user); // _id станет доступен

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(HTTP_STATUS_CODE.SUCCESS_CREATED).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: `${ERROR_MESSAGE.BAD_REQUEST}  при создании карточки`,
        });
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const { _id: userId } = req.user; // Идентификатор текущего пользователя

  Card.findById({
    _id: cardId,
  })
    .then((card) => {
      if (!card) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} карточка не найдена`,
        });
      }

      // Проверка, что текущий пользователь является владельцем карточки
      const { owner: cardOwnerId } = card;

      if (cardOwnerId.valueOf() !== userId) {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).send({
          message: "Нет доступа для удаления карточки",
        });
      }

      return Card.findByIdAndRemove(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} карточка не найдена`,
        });
      }

      return res.send({ data: deletedCard });
    })
    .catch(next);
};

const addLikeToCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (!card) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} Карточка c указанным id не найдена`,
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST}  для лайка`,
        });
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      if (!card) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({
          message: `${ERROR_MESSAGE.NOT_FOUND} Карточка c указанным id не найдена`,
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: `${ERROR_MESSAGE.BAD_REQUEST} для удаления лайка`,
        });
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
};
