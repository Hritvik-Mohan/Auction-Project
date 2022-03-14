const validateUserSchema = require("./validateUserSchema")
const validateUser = (req, res, next) => {
    console.log(req.body);
    const { error } = validateUserSchema.validate(req.body);
    if(error){
      console.log(error);
      const msg = error.details.map(e=>e.message).join(',');
      throw new AppError(msg, 400);
    }
    next();
}

module.exports = validateUser;
  