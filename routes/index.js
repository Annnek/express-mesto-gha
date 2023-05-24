const router = require("express").Router();
const NotFoundError = require("../errors/NotFoundError");
const userRouter = require("./users");
const cardRouter = require("./cards");

const { loginUser, registrationUser } = require("../controllers/users");

const {
  loginUserSchema,
  registrationUserSchema,
} = require("../middlewares/celebrate");

const authMiddleware = require("../middlewares/auth");

router.post("/signin", loginUserSchema, loginUser);
router.post("/signup", registrationUserSchema, registrationUser);

router.use(authMiddleware);
router.use("/users", userRouter);
router.use("/cards", cardRouter);
router.use("/*", (req, res, next) =>
  next(new NotFoundError("Запись не найдена.")),
);

module.exports = router;
