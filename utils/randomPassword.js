const getRandomLower = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);
const getRandomUpper = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
const getRandomNumber = () => Math.trunc(Math.random() * 10);
const getRandomSymbol = () => {
	const symbols = '@#'
	return symbols[Math.floor(Math.random() * symbols.length)];
}

const randomFunc = [
    getRandomLower, 
    getRandomUpper, 
    getRandomNumber, 
    getRandomSymbol
];

/**
 * This function generates a random password.
 * If no length is passed as an argument, it will generate a random password of length 8
 * Maximum length of password that can be generated is 15
 * 
 * @param {int} len : length of the password must be within range of 8 to 15
 * @returns {string} newPassword : password generated
 */
const randomPassword = (len = 8) => {
    len >= 8 && len <= 15 || (len = 8);
    let password = "";
    for(let i = 0; i<len; i++) {
        const func = randomFunc[Math.floor(Math.random() * randomFunc.length)];
        password += func();
    }                                                               
    const regex =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*[@_-]).{8,15}$/;

    const newPassword = password.match(regex) ? password : randomPassword(len);

    return newPassword;
}

module.exports = randomPassword;