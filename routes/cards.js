const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeToCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getCards);
router.post("/cards ", createCard);
router.delete("/cards/:cardId", deleteCard);
router.put("/:cardId/likes", addLikeToCard);
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
