const validateAge = (req, res, next) => {
    const ageInMilliseconds = new Date() - new Date(req.body.user.dob);
    const age =  Math.floor(ageInMilliseconds/1000/60/60/24/365); 
    if (age<18){
      throw new AppError('Sorry you are underage', 405);
    }
    next();
}

module.exports = validateAge;