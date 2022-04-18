"use strict";
console.log('productPage script loaded...');

// Global variables.
startTime = new Date(startTime).toISOString();
endTime = new Date(endTime).toISOString();
const labelTimer = document.getElementById('timer');
const today = new Date().toISOString();
let timeRemainingInSeconds;
let timer;

const initTimeSeconds = () => {
    const startTimeInSeconds = new Date(startTime).getTime() / 1000;
    const durationInSeconds = duration * 24 * 60 * 60;
    const endTimeInSeconds = startTimeInSeconds + durationInSeconds;

    // Get difference between current date and endTime in seconds.
    const differenceInSeconds = endTimeInSeconds - new Date(today).getTime() / 1000;
    timeRemainingInSeconds = Math.floor(differenceInSeconds);
}

const timeRemaining = () => {
    const days = Math.floor(timeRemainingInSeconds / (24 * 60 * 60));
    const hours = Math.floor(timeRemainingInSeconds % (24 * 60 * 60) / (60 * 60));
    const minutes = Math.floor(timeRemainingInSeconds % (24 * 60 * 60) % (60 * 60) / 60);
    const seconds = Math.floor(timeRemainingInSeconds % (24 * 60 * 60) % (60 * 60) % 60);

    labelTimer.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    if(timeRemainingInSeconds === 0){
        clearInterval(timer);
        document.getElementById('submit-bid')?.remove();
    }

    timeRemainingInSeconds--;
}

const init = () => {

    if(today >= startTime && today <= endTime){
        console.log('Auction is running...');
        initTimeSeconds();
        timer = setInterval(timeRemaining, 1000);
    } else if(today < startTime){
        console.log('Auction is not running yet...');
        labelTimer.textContent = 'Auction is not running yet...';
    } else {
        console.log('Auction is closed...');
        labelTimer.textContent = 'Auction is closed...';
    }
}
init();