const now = new Date()
console.log(now, now.toISOString());

const validateAge = (dob) => {
    const [d, m, y] = dob.split('-');
    console.log(d)
    console.log(m)
    console.log(y)
    const date = new Date();
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    console.log(date, day, month, year)
}

// validateAge('2-2-2022')

function getAge(dateString) {
    const ageInMilliseconds = new Date() - new Date(dateString);
    const age =  Math.floor(ageInMilliseconds/1000/60/60/24/365); 
    if (age<18){
        
    }

}
 console.log(getAge('1997-04-23'));