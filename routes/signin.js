const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { loginUser } = require("../controllers/users");

// Схема для валидации тела запроса loginUser
const loginUserSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
};

router.post("/signin", celebrate(loginUserSchema), loginUser);

module.exports = router;
