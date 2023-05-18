const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");

const {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

router.get("/", authMiddleware, getUsers);
router.get("/:userId", authMiddleware, getUserById);
router.get("/me", authMiddleware, getUserInfo);
router.post("/", createUser);
router.patch("/me", updateProfile);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
