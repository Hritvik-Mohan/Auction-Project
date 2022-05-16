/**
 * @description - This function is uses to handle the async errors.
 * 
 * @param {async function} f - The async function
 * @returns {function} - The middleware function
 */
const catchAsync = (f) => {
    return function(req, res, next){
        f(req, res, next).catch(e => next(e));
    }
}

module.exports =  catchAsync;