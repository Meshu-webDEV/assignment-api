const Joi = require("joi");

module.exports = Joi.object({
  username: Joi.string()
    .normalize()
    .trim()
    .alphanum()
    .min(3)
    .max(54)
    .required(),
  password: Joi.string().trim().min(6).max(124).required(),
});
