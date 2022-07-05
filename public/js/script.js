/**
 * Validation
 */

// window.onload = function () {
//     console.log("Loaded")


//     const dob = document.getElementById('dob');

//     const email = document.getElementById('email');

//     const firstName = document.getElementById('firstName');

//     const lastName = document.getElementById('lastName');

//     const password = document.getElementById('password');

//     const phoneNumber = document.getElementById('phoneNumber');

//     const title = document.getElementById('title');




//     const errorElement = document.getElementById('error');

//     const form = document.getElementById('form');
//     form.addEventListener('submit', (e) => {
//         let messages = [];
//         console.log(email.value);
//         if (email.length === 0 || email.value == null) {
//             messages.push('Email is required')
//             console.log(email.value);
//         }

//         if (password.value === '' || password.value == null) {
//             messages.push('Password is required')
//         }

//         if (password.value.length <= 6) {
//             messages.push("Password must be longer than 6 characters");
//         }

//         if (password.value.length >= 20) {
//             messages.push("Password must be less than 20 characters");
//         }

//         if(firstName.value === '' || firstName.value == null) {
//             messages.push('First name is required')
//         }

//         if(lastName.value === '' || lastName.value == null) {
//             messages.push('Last name is required')
//         }

//         if(dob.value === '' || dob.value == null) {
//             messages.push('Date of birth is required')
//         }

//         if(phoneNumber.value === '' || phoneNumber.value == null) {
//             messages.push('Phone number is required')
//         }

//         if (messages.length > 0) {
//             e.preventDefault();
//             errorElement.innerHTML = messages.join(', ')
//         }
//         console.log(messages);
//     })
// };