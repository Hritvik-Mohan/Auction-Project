"use strict";
console.log("registerationPage.js loaded...");
/**
 * Globals.
 */
// Valid extensions for image upload.
const _validFileExtensions = [".jpg", ".jpeg", ".png"];

// Form element.
const form = document.getElementById('form');

// Error div.
const errorDiv = document.getElementById('error');

// Input elements.
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const dob = document.getElementById('dob');
const password = document.getElementById('password');
const phoneNumber = document.getElementById('phoneNumber');
const avatar = document.getElementById('avatar');

// Choose file text.
window.pressed = function(){
    if(avatar.value == "")
    {
        fileLabel.innerHTML = "Choose file";
    }
    else
    {
        const theSplit = avatar.value.split('\\');
        fileLabel.innerHTML = theSplit[theSplit.length-1];
    }
};

/**
 * @description - This function validates the image file upload.
 * 
 * @param {HTML Element} oForm - The form element.
 * @returns {boolean} - Returns true if the form is valid.
 */    
const validateImage = (oForm) => {
    const arrInputs = oForm.getElementsByTagName("input");
    for (let i = 0; i < arrInputs.length; i++) {
        let oInput = arrInputs[i];
        if (oInput.type == "file") {
            let sFileName = oInput.value;
            if (sFileName.length > 0) {
                let blnValid = false;
                for (let j = 0; j < _validFileExtensions.length; j++) {
                    let sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }
                
                if (!blnValid) {
                    return false;
                }
            }
        }
    }
  
    return true;
}

/**
 * @description - This function check if entered dob is greater than 18 years
 * or not.
 * 
 * @param {String} dob - The date of birth.
 * @returns {boolean} - Returns true if the date of birth is valid.
 */
const isValidAge = (dob) => {
    const now = new Date();
    const birthDate = new Date(dob);
    const age = Math.floor((now - birthDate) / (365 * 24 * 60 * 60 * 1000));
    return age >= 18;
}

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
form.addEventListener('submit', (e) => {  
    let messages = [];

    if(firstName.value === '' || firstName.value == null) {
        messages.push('First name is required')
    }

    if(lastName.value === '' || lastName.value == null) {
        messages.push('Last name is required')
    }

    if(email.value === '' || email.value == null) {
        messages.push('Email is required')
    }

    if(validateEmail(email.value) === null) {
        messages.push('Email is invalid')
    }

    if(dob.value === '' || dob.value == null) {
        messages.push('Date of birth is required')
    }

    if(dob.value.length > 1 && !isValidAge(dob.value)) {
        messages.push('You must be at least 18 years old.')
    }

    if(password.value === '' || password.value == null) {
        messages.push('Password is required')
    }

    if(password.value.length <= 6) {
        messages.push("Password must be longer than 6 characters");
    }

    if(phoneNumber.value === '' || phoneNumber.value == null) {
        messages.push('Phone number is required')
    }

    if(phoneNumber.value.length !== 10) {
        messages.push("Phone number must be a valid 10 digits number");
    }

    if(avatar.value === '' || avatar.value == null) {
        messages.push('Profile pic is required')
    }

    if(avatar.value.length > 0 && !validateImage(form)) {
        messages.push('Profile pic is invalid')
    }

    if (messages.length > 0) {
        e.preventDefault();
        errorDiv.innerHTML = messages.join('<br>');
    }
});