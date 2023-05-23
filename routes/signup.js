const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { URL_REGEX } = require("../utils/constants");
const { registrationUser } = require("../controllers/users");

const registrationUserSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEX),
  }),
};

router.post("/signup", celebrate(registrationUserSchema), registrationUser);

module.exports = router;
