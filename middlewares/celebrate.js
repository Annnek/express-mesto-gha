const { celebrate, Joi } = require("celebrate");
const { URL_REGEX } = require("../utils/constants");

// Схема для валидации тела запроса loginUser
const loginUserSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

// Схема для валидации запроса на регистрацию пользователя
const registrationUserSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEX),
  }),
});

// Схема для валидации параметров запроса getUserById
const getUserByIdSchema = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

// Схема для валидации тела запроса updateProfile
const updateProfileSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

// Схема для валидации тела запроса updateAvatar
const updateAvatarSchema = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URL_REGEX),
  }),
});

// Схема для валидации тела запроса createCard
const createCardSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEX),
  }),
});

// Схема для валидации тела запроса удаления карточки
const deleteCardSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

// Схема для валидации тела запроса добавления лайка карточке
const addLikeSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

// Схема для валидации тела запроса удаления лайка карточки
const dislikeCardSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  loginUserSchema,
  registrationUserSchema,
  getUserByIdSchema,
  updateProfileSchema,
  updateAvatarSchema,
  createCardSchema,
  deleteCardSchema,
  addLikeSchema,
  dislikeCardSchema,
};
