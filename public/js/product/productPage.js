"use strict";
console.log('script loaded...');

const labelTimer = document.getElementById('timer');

// Get startTime.
startTime = new Date(startTime).toISOString();

// Convert startTime to seconds.
const startTimeInSeconds = new Date(startTime).getTime() / 1000;

// Get duration in seconds.
const durationInSeconds = duration * 24 * 60 * 60;

// Get endTime in seconds.
const endTimeInSeconds = startTimeInSeconds + durationInSeconds;

// Get current date in ISO format
const currentDate = new Date().toISOString();

// Get difference between current date and endTime in seconds.
const differenceInSeconds = endTimeInSeconds - new Date(currentDate).getTime() / 1000;

// Set global time variable.
let time = Math.floor(differenceInSeconds);

// Timeremaining function to update the timer.
const timeRemaining = () => {
    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor(time % (24 * 60 * 60) / (60 * 60));
    const minutes = Math.floor(time % (24 * 60 * 60) % (60 * 60) / 60);
    const seconds = Math.floor(time % (24 * 60 * 60) % (60 * 60) % 60);

    labelTimer.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    if(time === 0){
        clearInterval(timer);
        document.getElementById('submit-bid').remove();
    }

    time--;
}

// Set timer interval to update the timer.
var timer = setInterval(timeRemaining, 1000);