"use strict";
console.log("loginPage.js loaded...");
/**
 * Globals.
 */

// Form element.
const form = document.getElementById('form');

// Error div.
const errorDiv = document.getElementById('error');

// Input elements.
const email = document.getElementById('email');
const password = document.getElementById('password');

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

// Form validation
form.addEventListener('submit', (e)=>{
    let messages = [];

    if (email.value === '' || email.value == null) {
        messages.push('Email is required')
    }

    if (email.value.lenght > 1 && validateEmail(email.value) === null) {
        messages.push('Email is invalid')
    }

    if (password.value === '' || password.value == null) {
        messages.push('Password is required')
    }

    if (password.value.length > 1 && password.value.length <= 6) {
        messages.push("Password must be longer than 6 characters");
    }

    if (messages.length > 0) {
        e.preventDefault();
        errorDiv.innerHTML = messages.join('<br>');
    }
});