const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { URL_REGEX } = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // имя — это строка
      required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: "Имя пользователя должно быть длиной от 2 до 30 символов",
      },
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      required: true,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message:
          "Информация о пользователе должна быть длиной от 2 до 30 символов",
      },
      default: "Исследователь",
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: "Некорректная ссылка на аватар",
      },
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Введите корректный адрес электронной почты",
      },
    },
    password: {
      type: String,
      required: true,
      select: false, // чтобы API не возвращал хеш пароля
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select("+password")
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) return user;

                return Promise.reject();
              });
            }

            return Promise.reject();
          });
      },
    },
  },
);

module.exports = mongoose.model("user", userSchema);
