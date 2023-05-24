const router = require("express").Router();

const {
  getUsers,
  getUserInfo,
  getUserById,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

const {
  getUserByIdSchema,
  updateProfileSchema,
  updateAvatarSchema,
} = require("../middlewares/celebrate");

// Применение валидации перед обработчиками запросов
router.get("/", getUsers);
router.get("/me", getUserInfo);
router.get("/:userId", getUserByIdSchema, getUserById);
router.patch("/me", updateProfileSchema, updateProfile);
router.patch("/me/avatar", updateAvatarSchema, updateAvatar);

module.exports = router;
