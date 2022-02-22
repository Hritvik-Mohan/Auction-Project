const Joi = require('joi');

const userSchema = Joi.object({
    user: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        image: Joi.string().empty('').default('https://i.imgur.com/FPnpMhC.jpeg'),
    })
})

module.exports = userSchema;