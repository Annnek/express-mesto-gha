const express = require("express");

const mongoose = require("mongoose");

const { errors } = require("celebrate");

const routeSignin = require("./routes/signin");
const routeSignup = require("./routes/signup");

const auth = require("./middlewares/auth");

const routes = require("./routes/index");

const errorHandler = require("./middlewares/errorHandler");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routeSignin);
app.use("/", routeSignup);
app.use(auth);
app.use(routes);
app.use(errors());
app.use(errorHandler);

// app.use((error, req, res, next) => {
//   const { status = 500, message } = error;
//   res.status(status).send({
//     message: status === 500 ? "На сервере произошла ошибка" : message,
//   });
//   next();
// });

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
