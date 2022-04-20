"use strict";
console.log('productPage script loaded...');

// Global variables.
startTime = new Date(startTime).toISOString();
endTime = new Date(endTime).toISOString();
const labelTimer = document.getElementById('timer');
const today = new Date().toISOString();
let timeRemainingInSeconds;
let timer;

// Inititalize the times in seconds.
const initTimeSeconds = () => {
    const startTimeInSeconds = new Date(startTime).getTime() / 1000;
    const durationInSeconds = duration * 24 * 60 * 60;
    const endTimeInSeconds = startTimeInSeconds + durationInSeconds;

    // Get difference between current date and endTime in seconds.
    const differenceInSeconds = endTimeInSeconds - new Date(today).getTime() / 1000;
    timeRemainingInSeconds = Math.floor(differenceInSeconds);
}

// Calculate the time remaining.
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
        const MILLISECONDS_IN_A_SECOND = 1000;
        timer = setInterval(timeRemaining,MILLISECONDS_IN_A_SECOND);
    } else if(today < startTime){
        console.log('Auction is not running yet...');
        labelTimer.textContent = 'Auction is not running yet...';
        document.getElementById('submit-bid')?.remove();
    } else {
        console.log('Auction is closed...');
        labelTimer.textContent = 'Auction is closed...';
        document.getElementById('submit-bid')?.remove(); 
    }
}
init();