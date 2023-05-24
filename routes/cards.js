const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
} = require("../controllers/cards");

const {
  createCardSchema,
  deleteCardSchema,
  addLikeSchema,
  dislikeCardSchema,
} = require("../middlewares/celebrate");

router.get("/", getCards);
router.post("/", createCardSchema, createCard);
router.delete("/:cardId", deleteCardSchema, deleteCard);
router.put("/:cardId/likes", addLikeSchema, addLikeToCard);
router.delete("/:cardId/likes", dislikeCardSchema, dislikeCard);

module.exports = router;
