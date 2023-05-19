const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: function validateAvatar(value) {
        // Регулярное выражение для проверки ссылки на аватар
        const urlRegex =
          /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/;
        return urlRegex.test(value);
      },
      message: "Некорректная ссылка на аватар",
    },
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
    minlength: 8,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

module.exports = mongoose.model("user", userSchema);
