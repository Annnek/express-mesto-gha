const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { URL_REGEX } = require("../utils/constants");

const {
  getUsers,
  getUserInfo,
  getUserById,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

// Схема для валидации параметров запроса getUserById
const getUserByIdSchema = {
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
};

// Схема для валидации тела запроса updateProfile
const updateProfileSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

// Схема для валидации тела запроса updateAvatar
const updateAvatarSchema = {
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URL_REGEX),
  }),
};

// Применение валидации перед обработчиками запросов
router.get("/", getUsers);
router.get("/me", getUserInfo);
router.get("/:userId", celebrate(getUserByIdSchema), getUserById);
router.patch("/me", celebrate(updateProfileSchema), updateProfile);
router.patch("/me/avatar", celebrate(updateAvatarSchema), updateAvatar);

module.exports = router;
