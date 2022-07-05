console.log("addAddress.js is loaded...");
// Form element.
const form = document.getElementById('form');

// Input elements shipping address.
const s_name =  document.querySelector("form[name='addressForm'] input[name='s_name']");
const s_phoneNumber = document.querySelector("form[name='addressForm'] input[name='s_phoneNumber']");
const s_address = document.querySelector("form[name='addressForm'] input[name='s_address']");
const s_city = document.querySelector("form[name='addressForm'] input[name='s_city']");
const s_state = document.querySelector("form[name='addressForm'] input[name='s_state']");
const s_pincode = document.querySelector("form[name='addressForm'] input[name='s_pincode']");

// Input element billing address.
const b_name = document.querySelector("form[name='addressForm'] input[name='b_name']");
const b_phoneNumber = document.querySelector("form[name='addressForm'] input[name='b_phoneNumber']");
const b_address = document.querySelector("form[name='addressForm'] input[name='b_address']");
const b_city = document.querySelector("form[name='addressForm'] input[name='b_city']");
const b_state = document.querySelector("form[name='addressForm'] input[name='b_state']");
const b_pincode = document.querySelector("form[name='addressForm'] input[name='b_pincode']");

// Checkbox element.
const sameCheckbox = document.querySelector("form[name='addressForm'] input[name='same']");

// Error div.
const errorDiv = document.getElementById('error');

// Event listener to autofill billing address.
// if both billing and shipping address are same.
sameCheckbox.addEventListener('click', ()=>{
    if(sameCheckbox.checked){
        b_name.value = s_name.value;
        b_phoneNumber.value = s_phoneNumber.value;
        b_address.value = s_address.value;
        b_city.value = s_city.value;
        b_state.value = s_state.value;
        b_pincode.value = s_pincode.value;
    } else {
        b_name.value = "";
        b_phoneNumber.value = "";
        b_address.value = "";
        b_city.value = "";
        b_state.value = "";
        b_pincode.value = "";
    }
});

// Form validation.
form.addEventListener('submit', (e)=>{
    const messages = [];
    if(s_name.value === '' || s_name.value === null){
        messages.push('Shipping address Full name is required.');
    }
    if(s_phoneNumber.value === '' || s_phoneNumber.value === null){
        messages.push('Shipping address Phone number is required.');
    }
    if(s_address.value === '' || s_address.value === null){
        messages.push('Shipping address is required.');
    }
    if(s_city.value === '' || s_city.value === null){
        messages.push('Shipping address City is required.');
    }
    if(s_state.value === '' || s_state.value === null){
        messages.push('Shipping address State is required.');
    }
    if(s_pincode.value === '' || s_pincode.value === null){
        messages.push('Shipping address Pincode is required.');
    }

    if(sameCheckbox.checked){
        b_name.value = s_name.value;
        b_phoneNumber.value = s_phoneNumber.value;
        b_address.value = s_address.value;
        b_city.value = s_city.value;
        b_state.value = s_state.value;
        b_pincode.value = s_pincode.value;
    }

    if(b_name.value === '' || b_name.value === null){
        messages.push('Billing address Full name is required.');
    }
    if(b_phoneNumber.value === '' || b_phoneNumber.value === null){
        messages.push('Billing address Phone number is required.');
    }
    if(b_address.value === '' || b_address.value === null){
        messages.push('Billing address is required.');
    }
    if(b_city.value === '' || b_city.value === null){
        messages.push('Billing address City is required.');
    }
    if(b_state.value === '' || b_state.value === null){
        messages.push('Billing address State is required.');
    }
    if(b_pincode.value === '' || b_pincode.value === null){
        messages.push('Billing address Pincode is required.');
    }
    
    if(messages.length > 0){
        e.preventDefault();
        errorDiv.innerHTML = messages.join('<br>');
    }
});