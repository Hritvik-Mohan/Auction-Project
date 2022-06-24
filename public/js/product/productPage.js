"use strict";
console.log('productPage script loaded...');

// Global variables.
startTime = new Date(startTime).toISOString();
endTime = new Date(endTime).toISOString();
highestBidInfo = JSON.parse(highestBidInfo)
try {
    loggedinUserId = JSON.parse(loggedinUserId);
} catch(err){
    loggedinUserId = null;
}

const contactSellerDiv = document.getElementById('contact-seller');
const labelTimer = document.getElementById('timer');
const bidContainer = document.getElementById('bid-container');

const btnCheckFetch = document.getElementById('check-fetch');

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

// Function to declare the winner for frontend.
const declareWinnerFrontend = () => {
    const {
        firstName,
        lastName,
        _id
    } = highestBidInfo.user;
    const html = `
       <div>
            <h1>Winner!</h1>
            <p>Congrats ${firstName} ${lastName} for winning this product 🎉</p>
            <p><a href="/users/${_id}">See profile</a></p>
       </div>
    `;

    bidContainer.insertAdjacentHTML('afterbegin', html);
}

const showContactSeller = () => {
    const contactSellerForm = `
        <form action='/contactSeller/${productId}/' method='GET'>
            <button class="btn btn-success">Contact Seller</button>
        </form>
        <a href="/products/checkout/${productId}" class="btn btn-primary">
            Checkout
        </a>
    `;
    if(loggedinUserId != null && loggedinUserId._id && loggedinUserId._id === highestBidInfo.user._id){
        contactSellerDiv.innerHTML = contactSellerForm;
    }
}



// Function to POST data to the server.
async function postData(url = '', data = '') {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: data 
    });
    return response.json();
  }

// Converts an object to a query string.
// Note: Do not use nested objects to turn them into query string.
const encodeFormData = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

// Function to make a POST request to the server to declare the winner.
const declareWinnerBackend = () => {
    if(highestBidInfo.user){
        const data = {
            amount: highestBidInfo.amount,
            userId: highestBidInfo.user._id,
            bidId: highestBidInfo.bid
        };
        
        const url = NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://hackerspace-auctionapp.herokuapp.com';

        postData(`${url}/products/${productId}`, encodeFormData(data) )
        .then(data => {
            console.log(data); 
        });
    }
}

// Calculate the time remaining.
const timeRemaining = () => {
    const days = Math.floor(timeRemainingInSeconds / (24 * 60 * 60));
    const hours = Math.floor(timeRemainingInSeconds % (24 * 60 * 60) / (60 * 60));
    const minutes = Math.floor(timeRemainingInSeconds % (24 * 60 * 60) % (60 * 60) / 60);
    const seconds = Math.floor(timeRemainingInSeconds % (24 * 60 * 60) % (60 * 60) % 60);

    labelTimer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (timeRemainingInSeconds === 0) {
        clearInterval(timer);
        document.getElementById('submit-bid')?.remove();
        if(highestBidInfo.user) {
            declareWinnerFrontend();
            declareWinnerBackend();
            showContactSeller();
        }
    }

    timeRemainingInSeconds--;
}



const main = () => {

    if (today >= startTime && today <= endTime) {
        console.log('Auction is running...');
        initTimeSeconds();
        const MILLISECONDS_IN_A_SECOND = 1000;
        timer = setInterval(timeRemaining, MILLISECONDS_IN_A_SECOND);
    } else if (today < startTime) {
        console.log('Auction is not running yet...');
        labelTimer.textContent = 'Auction is not running yet...';
        document.getElementById('submit-bid')?.remove();
    } else {
        console.log('Auction is closed...');
        labelTimer.textContent = 'Auction is closed...';
        if(highestBidInfo.user){
            declareWinnerFrontend();
            declareWinnerBackend();
            showContactSeller();
        }
        document.getElementById('submit-bid')?.remove();
    }
}
main();