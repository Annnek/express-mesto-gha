const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const authMiddleware = require("../middlewares/auth");

const {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

// Схема для валидации тела запроса createUser
const createUserSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// Схема для валидации параметров запроса getUserById
const getUserByIdSchema = {
  params: Joi.object({
    userId: Joi.string().required(),
  }),
};

// Схема для валидации тела запроса updateProfile
const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string(),
    about: Joi.string(),
  }),
};

// Схема для валидации тела запроса updateAvatar
const updateAvatarSchema = {
  body: Joi.object({
    avatar: Joi.string()
      .pattern(/^https?:\/\/.*$/)
      .required(),
  }),
};

// Применение валидации перед обработчиками запросов
router.get("/", authMiddleware, getUsers);
router.get(
  "/:userId",
  authMiddleware,
  celebrate(getUserByIdSchema),
  getUserById,
);
router.get("/me", authMiddleware, getUserInfo);
router.post("/", celebrate(createUserSchema), createUser);
router.patch("/me", celebrate(updateProfileSchema), updateProfile);
router.patch("/me/avatar", celebrate(updateAvatarSchema), updateAvatar);

// router.get("/", authMiddleware, getUsers);
// router.get("/:userId", authMiddleware, getUserById);
// router.get("/me", authMiddleware, getUserInfo);
// router.post("/", createUser);
// router.patch("/me", updateProfile);
// router.patch("/me/avatar", updateAvatar);

module.exports = router;
