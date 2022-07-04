console.log("addAddress.js is loaded...");

const s_name =  document.querySelector("form[name='addressForm'] input[name='s_name']");
const s_phoneNumber = document.querySelector("form[name='addressForm'] input[name='s_phoneNumber']");
const s_address = document.querySelector("form[name='addressForm'] input[name='s_address']");
const s_city = document.querySelector("form[name='addressForm'] input[name='s_city']");
const s_state = document.querySelector("form[name='addressForm'] input[name='s_state']");
const s_pincode = document.querySelector("form[name='addressForm'] input[name='s_pincode']");

const b_name = document.querySelector("form[name='addressForm'] input[name='b_name']");
const b_phoneNumber = document.querySelector("form[name='addressForm'] input[name='b_phoneNumber']");
const b_address = document.querySelector("form[name='addressForm'] input[name='b_address']");
const b_city = document.querySelector("form[name='addressForm'] input[name='b_city']");
const b_state = document.querySelector("form[name='addressForm'] input[name='b_state']");
const b_pincode = document.querySelector("form[name='addressForm'] input[name='b_pincode']");

const sameCheckbox = document.querySelector("form[name='addressForm'] input[name='same']");

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
