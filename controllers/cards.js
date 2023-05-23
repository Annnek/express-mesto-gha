const Card = require("../models/card");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { userId } = req.user;
  console.log(req.user); // _id станет доступен

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки",
          ),
        );
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user; // Идентификатор текущего пользователя

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с данным id не найдена");
      }

      // Проверка, что текущий пользователь является владельцем карточки
      const { owner: cardOwnerId } = card;

      if (cardOwnerId.valueOf() !== userId) {
        throw new ForbiddenError("Нет доступа для удаления карточки");
      }

      return Card.findByIdAndRemove(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError("Карточка не найдена");
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
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundError("Карточка с указанным id не найдена");
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при добавлении лайка карточке",
          ),
        );
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundError("Данные по указанному id не найдены");
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при удалении лайка карточки",
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
};
