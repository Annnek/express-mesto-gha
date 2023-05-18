const express = require("express");

const mongoose = require("mongoose");

const routes = require("./routes");

const { login, createUser } = require("./controllers/users");

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "64543c45285aaec4cc658fdd", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(routes);
app.post("/signin", login);
app.post("/signup", createUser);

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
