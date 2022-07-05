"use strict";
console.log("confirmOTPpage.js loaded...");
/**
 * Globals.
 */
// Form element.
const form = document.getElementById('form');

// Error div.
const errorDiv = document.getElementById('error');

// Input elements.
const email = document.getElementById('email');
const otp = document.getElementById('otp');

/**
 * @description - This function checks if email is valid or not.
 * 
 * @param {String} email 
 * @returns null if email is invalid.
 * @returns {Array} if email is valid.
 */
 const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Form validation.
form.addEventListener('submit', (e)=>{
    let messages = [];

    if (email.value === '' || email.value == null) {
        messages.push('Email is required')
    }

    if (email.value.length > 1 && validateEmail(email.value) === null) {
        messages.push('Email is invalid')
    }

    if (otp.value === '' || otp.value == null) {
        messages.push('Password is required')
    }

    if (otp.value.length !== 6) {
        messages.push("Invalid OTP");
    }

    if(Number.isNaN(parseInt(otp.value))){
        messages.push("OTP must be a valid 6 digit number");
    }

    if (messages.length > 0) {
        e.preventDefault();
        errorDiv.innerHTML = messages.join('<br>');
    }
});