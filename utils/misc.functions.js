/**
 * @description - This function returns the date eighteen years ago from now.
 * 
 * @returns String - Date in the format of YYYY-MM-DD
 */
const dateEighteenYearsAgo = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));
    const year = eighteenYearsAgo.getFullYear();
    const month = (eighteenYearsAgo.getMonth()+"").padStart(2, "0");
    const date = (eighteenYearsAgo.getDate()+"").padStart(2, "0");
    return `${year}-${month}-${date}`;
}

module.exports = { dateEighteenYearsAgo };