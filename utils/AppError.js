/**
 * This class creates a custom error
 * object that can be used to create
 * custom error messages.
 * 
 * @param {string} message
 * @param {string} status
 * 
 * @returns {object}
 */
class AppError extends Error {
    constructor(message, status){
        super(message);
        this.message = message;
        this.status = status;
    }
}

module.exports = AppError;