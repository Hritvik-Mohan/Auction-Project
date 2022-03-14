const catchAsync = (f) => {
    return function(req, res, next){
        f(req, res, next).catch(e => next(e));
    }
}

module.exports =  catchAsync;