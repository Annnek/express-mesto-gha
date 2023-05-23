const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { URL_REGEX } = require("../utils/constants");

const {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
} = require("../controllers/cards");

const createCardSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEX),
  }),
};

const deleteCardSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
};

const addLikeSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
};

const dislikeCardSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
};

router.get("/", getCards);
router.post("/", celebrate(createCardSchema), createCard);
router.delete("/:cardId", celebrate(deleteCardSchema), deleteCard);
router.put("/:cardId/likes", celebrate(addLikeSchema), addLikeToCard);
router.delete("/:cardId/likes", celebrate(dislikeCardSchema), dislikeCard);

module.exports = router;
