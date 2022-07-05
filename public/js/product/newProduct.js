"use strict";
console.log('newProduct.js loaded...');

/**
 * Globals
 */
// Valid extensions for image upload.
const _validFileExtensions = [".jpg", ".jpeg", ".png"];

// Form element.
const form = document.getElementById('form');

// Error div.
const errorDiv = document.getElementById('error');

// Input elements.
const title = document.getElementById('title');
const description = document.getElementById('description');
const base_price = document.getElementById('base_price');
const category = document.getElementById('category');
const file = document.getElementById('file');
const startTime = document.getElementById('startTime');
const duration = document.getElementById('duration');

// Choose file text.
window.pressed = function(){
    if(file.value == "") {
        fileLabel.innerHTML = "Choose file";
    } else {
        const theSplit = file.value.split('\\');
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
 * @description - This function checks if startTime is greater than current date 
 * and time or not. The starTime of the product auction must be greater than current
 * date and time.
 * 
 * @param {String} startTime - The start time of the product. eg: '2022-07-05T19:57' 
 * @returns {boolean}
 * 
 * TODO: - Need some discussion on this.
 */
const isStartTimeValid = (startTime) => {
    const now = new Date();
    const startTimeDate = new Date(startTime);
    return startTimeDate > now;
}

form.addEventListener('submit', (e)=>{
    const messages = [];

    if (title.value === '' || title.value == null) {
        messages.push('Title is required');
    }

    console.log(`Start time`,startTime.value);

    if(title.value.length < 3){
        messages.push('Title must be longer than 3 characters');
    }

    if (description.value === '' || description.value == null) {
        messages.push('Description is required');
    }

    if(description.value.length < 10){
        messages.push('Description must be longer than 10 characters');
    }

    if (base_price.value === '' || base_price.value == null) {
        messages.push('Base price is required');
    }

    if(parseInt(base_price.value) <= 0){
        messages.push('Base price must be greater than 0');
    }

    if (category.value === '' || category.value == null) {
        messages.push('Category is required');
    }

    if(file.value === '' || file.value == null) {
        messages.push('Product image is required');
    }

    if(file.value.length > 0 && !validateImage(form)) {
        messages.push('Product image is invalid');
    }

    if(startTime.value === '' || startTime.value == null){
        messages.push('Start time is required');
    }

    
    if(duration.value === '' || duration.value == null){
        messages.push('Duration is required');
    }

    if (messages.length > 0) {
        e.preventDefault();
        errorDiv.innerHTML = messages.join('<br>');
    }
});