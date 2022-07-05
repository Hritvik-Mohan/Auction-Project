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

const bidForm = document.getElementById('bid-form');

// Current product price.
const currentPrice = parseInt(highestBidInfo.amount) || parseInt(basePrice);

const contactSellerDiv = document.getElementById('contact-seller');
const labelTimer = document.getElementById('timer');
const bidContainer = document.getElementById('bid-container');

// Button selectors.
const btnCheckFetch = document.getElementById('check-fetch');
const btnPlaceBid = document.getElementById("placeBid");
const btnQuickBid = document.getElementById("quickBid");

// Date and Time variable.
const today = new Date().toISOString();
let timeRemainingInSeconds;
let timer;

// Form
const form = document.getElementById('form');
// Error div
const errorDiv = document.getElementById('error');

// Input element.
const bidAmount = document.getElementById('bidAmount');
const displayQuickBid = document.getElementById('displayQuickBid');
const quickBidInput = document.getElementById('quickBidInput');

/**
 * @description - This function sets the minimum and
 * maximum amount to bid on the product.
 */
const validBidAmount = () => {
    const currentPriceLength = (currentPrice + '').length;
    switch(currentPriceLength){
        case 1: 
            bidAmount.min = `${currentPrice + 1}`;
            quickBidInput.value = bidAmount.min;
            displayQuickBid.placeholder = `₹ ${bidAmount.min} /-`;
            bidAmount.max = `${currentPrice * 2}`; 
            break;
        case 2: 
            bidAmount.min = `${currentPrice + 5}`;
            quickBidInput.value = bidAmount.min;
            displayQuickBid.placeholder = `₹ ${bidAmount.min} /-`;
            bidAmount.max = `${currentPrice * 2}`; 
            break;
    }
    if(currentPriceLength > 2){
        bidAmount.min = currentPrice + Math.pow(10, currentPriceLength - 2);
        quickBidInput.value = bidAmount.min;
        displayQuickBid.placeholder = `₹ ${bidAmount.min} /-`;
        bidAmount.max = currentPrice * 2;
    }
}

// Enable or disable submit-bid and quick-bid button.
const enableDisableBidButtons = () => {
    const auctionEndTime = new Date(endTime);
    const now = new Date();

    if(now > auctionEndTime) {
        // Change placeholder text of bidAmount input.
        bidAmount.placeholder = `Auction ended`;
        bidForm.classList.add('auction-ended');
        btnPlaceBid.disabled = true;
        btnQuickBid.disabled = true;
    }
}

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
       <div class="product-winner-text">
            <h1 class="product-winner-h">You’re the <br>winner! 🎉</h1>
            <p class="product-winner-p">Congrats <u><a href="/users/${_id}">${firstName} ${lastName}</a></u> for winning this auction.</p>
        </div>
    `;

    bidContainer.insertAdjacentHTML('afterbegin', html);
}

const showContactSeller = () => {
    const contactSellerForm = `
        <div class="contact-checkout--seller formGrid-2">
            <div class="contact-seller">
                <form action='/contactSeller/${productId}/' method='GET'>
                    <button class="contact-seller-button">Contact Seller</button>
                </form>
            </div>
            <div class="checkout">
                <a href="/products/checkout/${productId}" >
                    <button class="checkout-button">Checkout</button>
                </a>
            </div>
        </div>
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

    enableDisableBidButtons();
    
    if (today >= startTime && today <= endTime) {
        console.log('Auction is running...');
        initTimeSeconds();
        validBidAmount();
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

const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });