const express = require("express");

const mongoose = require("mongoose");

const { errors } = require("celebrate");

const routes = require("./routes");

const { login, createUser } = require("./controllers/users");

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signin", login);
app.post("/signup", createUser);
app.use(routes);

app.use(errors());

app.use((error, request, response, next) => {
  const { status = 500, message } = error;
  response.status(status).send({
    message: status === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
