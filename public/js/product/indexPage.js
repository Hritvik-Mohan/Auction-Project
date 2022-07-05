"use strict";
console.log('productPage script loaded...'); 
const today = new Date().toISOString();
let prodArr = JSON.parse(products);

const initTimeSeconds = (product) => {
    const startTimeInSeconds = new Date(product.startTime).getTime() / 1000;
    const durationInSeconds = product.duration * 24 * 60 * 60;
    const endTimeInSeconds = startTimeInSeconds + durationInSeconds;

    // Get difference between current date and endTime in seconds.
    const differenceInSeconds = endTimeInSeconds - new Date(today).getTime() / 1000;
    return Math.floor(differenceInSeconds);
}

// Calculate the time remaining.
const timeRemaining = (product) => {
    const days = Math.floor(product.timeRemainingInSeconds / (24 * 60 * 60));
    const hours = Math.floor(product.timeRemainingInSeconds % (24 * 60 * 60) / (60 * 60));
    const minutes = Math.floor(product.timeRemainingInSeconds % (24 * 60 * 60) % (60 * 60) / 60);
    const seconds = Math.floor(product.timeRemainingInSeconds % (24 * 60 * 60) % (60 * 60) % 60);

    const labelTimer = document.getElementById(`timer-${product._id}`);
    labelTimer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (product.timeRemainingInSeconds === 0) {
        clearInterval(product.timer);
        labelTimer.textContent = `CLOSED`;
    } 

    product.timeRemainingInSeconds--;
}

const main = () => {
    // console.log(productTimers);
    // createTimer();
    prodArr.forEach(product => {
        const startTime = new Date(product.startTime).toISOString();
        const startTimeInSeconds = new Date(startTime).getTime() / 1000;
        const endTimeInSeconds = startTimeInSeconds + (product.duration * 24 * 60 * 60);
        let endTime = new Date(endTimeInSeconds * 1000);
        endTime =  endTime.toISOString();

        if (today >= startTime && today <= endTime) {
            console.log('Auction is running...');
            product.timeRemainingInSeconds = initTimeSeconds(product);
            const MILLISECONDS_IN_A_SECOND = 1000;
            product.timer = setInterval(()=>{
                timeRemaining(product);
            }, MILLISECONDS_IN_A_SECOND);
        } else if (today < startTime) {
            const labelTimer = document.getElementById(`timer-${product._id}`);
            labelTimer.textContent = `OFFLINE`;
        } else {
            const labelTimer = document.getElementById(`timer-${product._id}`);
            labelTimer.textContent = `CLOSED`;
        }

    });
}

main();