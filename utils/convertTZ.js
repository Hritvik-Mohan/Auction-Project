/**
 * @description - Converts a date to a different timezone
 * 
 * @param {string} date - The date string. 
 * @param {string} tzString - The timezone string.
 * @default tzString = 'Asia/Kolkata'
 * @returns {object} - The converted date object.
 */
module.exports.convertTZ = (date, tzString='Asia/Kolkata') => {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}