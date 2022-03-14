/**
 * Node Module Imports
 */
const validator = require("validator");

/**
 * Utils imports
 */
const catchAsync = require("../../utils/catchAsync")

/**
 * Models Imports.
 */
const User = require("../../models/user.model");

/**
 * This function Registers a new user
 * 
 * @param {object} req contains object of data required for registration
 * @param {object} res response object 
 * @returns {undefined}
 */
module.exports.register = catchAsync(async (req,res) => {
  const { 
    email, 
    firstName, 
    lastName, 
    password, 
    phoneNumber, 
    image ,
    role, 
    dob
  } = req.body;

  if(!role){
    role = "ROLE_USER"
  }
  if(!email || !firstName || !lastName || !password || !phoneNumber || !dob){
    return res.status(400).send({ error: 'email, firstName, lastName, password and phoneNumber are required' });
  }
  const existingUser = await User.findOne({
    $or : [
      {email}, //Check if this matches
      {phoneNumber} // OR this matches
    ]
  }); // Check for email and phoneNumber
  if (existingUser) {
    return res
      .status(400)
      .send({ error: 'That email address OR phoneNumebr is already in use.' });
  }

  if(!validator.isEmail(email)){
    return res.status(400).send({error: 'Invalid email'});
  }

  if(!validator.isAlpha(firstName)){
    return res.status(400).send({error: 'Invalid First Name'});
  }

  if(!validator.isAlpha(lastName)){
    return res.status(400).send({error: 'Invalid Last Name'});
  }

  if(!validator.isMobilePhone(phoneNumber)){
    return res.status(400).send({error: 'Invalid Phone Number'});
  }

  const user = new User({
    email,
    firstName,
    lastName,
    password,
    phoneNumber,
    role,
    dob
  });

  const registeredUser = await user.save();

  const token =  newToken(registeredUser);

  res.status(200).send({
    success: true,
    token: `${token}`,
    user: {
      id: registeredUser.id,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      email: registeredUser.email,
      dob: registeredUser.dob,
      role: registeredUser.role,
      phoneNumber : registeredUser.phoneNumber
    }
  });
})



/**
 * This login function checks if the user exists, if yes then
 * checks if the password verifies to the hash. If matched provides a JWT Token
 * 
 * @param {object} req contains email/phoneNumber Password
 * @param {object} res response object
 * @returns undefined
 */
module.exports.signin = catchAsync(async (req, res) => {
  if (!req.body.credId || !req.body.password)
    return res.status(400).send({ message: "CredId and password required" });

    let searchQuery = {};
    if(validator.isEmail(req.body.credId)){
      searchQuery = {
        email : req.body.credId
      }
    }else if(validator.isMobilePhone(req.body.credId)){
      searchQuery = {
        phoneNumber : req.body.credId
      }
    }else {
      return res.status(400).send({error: 'Entered CredId is neither a valid Email or Phone Number '});
    }

  const user = await User.findOne(searchQuery)
      .exec();
  if (!user) {
      return res.status(200).send({status:"failed", message: "Email/Phone Number not registered"});
  }
      const match = await user.checkPassword(req.body.password);
      if (!match) {
      return res.status(200).send({status:"failed",message: "Invalid Email or Password" });
      }
      const token = newToken(user);
      return res.status(201).send({
          status: "ok", 
          token: token,
          user : {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phoneNumber : user.phoneNumber
          }
      });
})

  

/**
 * This login function checks if the user exists, if yes then
 * generates a otp and saves it to user db then sends the reset
 * password link to the user email with the otp
 * 
 * @param {object} req contains email
 * @param {object} res response object
 * @returns undefined
 */
module.exports.forgotPassword = catchAsync(async (req, res) => {  
  const { credId } = req.body
  if (!credId)
      return res.status(400).send({
          message: "CredId is required"
      });

  let searchQuery = {};
  let sendOtpTo = "";

  if (validator.isEmail(credId)) {
      searchQuery = {
          email: credId,
      };
      sendOtpTo = "email";
  } else if (validator.isMobilePhone(credId)) {
      searchQuery = {
          phoneNumber: credId,
      };
      sendOtpTo = "phone";
  } else {
      return res
          .status(400)
          .send({
              error: "Entered credId is neither a valid Email or Phone Number ",
          });
  }

  // 1. Finding the user with the searchQuery
  const user = await User.findOne(searchQuery).exec();
  if (!user)
      return res
          .status(400)
          .send({
              status: "failed",
              message: "Email/Phone Number not registered",
          });

  // 2. Generating a 6 digit random number for otp
  const otp = Math.floor(100000 + Math.random() * 900000);

  // 3. Setting the generated otp to the users otp property
  user.otp = otp;

  // 4. Save the user
  await user.save();
  // 5. Sending the otp to email or phone depending upon the sendOtpTo variable
  if (sendOtpTo === "email") {
        const mailOptions = {
            to: credId,
            subject: 'OTP for Password Reset',
            html: forgot_password_template(otp)
        };
        await sendMail(mailOptions);
  } else {
      // Message to send
      const msg = `Your OTP for password reset is ${otp}. Use this OTP to get resetted password to your registered email or phone.`;

      // Sending the message to the user
      const {
          status,
          message
      } = await sendOtpPhone(credId, msg);
      if (status === "failed") return res.status(400).send({
          status,
          message
      });
  }

  // 6. Sending the response
  res.status(201).send({
      status: "ok",
      message: `OTP sent to your ${sendOtpTo} with reset password link`,
  });
})
  

/**
 * This reset password function checks the email and otp 
 * received from the user and if matched then changes the password
 * and sends email to the user with the new password
 * 
 * @param {object} req contains email and otp
 * @param {object} res response object
 * @returns undefined
 */
module.exports.resetPassword = catchAsync(async (req, res) => {  
  const { credId, otp } = req.body;
  if (!credId || !otp)
      return res.status(400).send({
          message: "CredId and OTP are required"
      });

  let searchQuery = {};
  let sendResetTo = "";

  if (validator.isEmail(credId)) {
      searchQuery = {
          email: credId,
      };
      sendResetTo = "email";
  } else if (validator.isMobilePhone(credId)) {
      searchQuery = {
          phoneNumber: credId,
      };
      sendResetTo = "phone";
  } else {
      return res
          .status(400)
          .send({
              error: "Entered CredId is neither a valid Email or Phone Number ",
          });
  }

  // 1. Finding the user with searchQuery
  const user = await User.findOne(searchQuery).exec();
  if (!user) return res.status(400).send({
      error: "User does not exists"
  });

  // 2. Checking if the otp matches the one in the database
  const result = await user.checkOTP(otp);
  if (!result) return res.status(400).send({
      error: "Invalid OTP"
  });

  // 4. Generating a random password of length 8
  const password = randomPassword(8);

  // 5. Save the newly generated password to the user database
  user.password = password;

  // 6. Clear the otp field from the user database
  user.otp = "";

  // 7. Save the user
  await user.save();

  // 7. Send the newly generated password to the user's email or phone
  if (sendResetTo === "email") {
      const mailOptions = {
          to: credId,
          subject: 'Password Reset ',
          html: reset_password_template(credId, password)
      };
      await sendMail(mailOptions);
  } else {
      // Message to send 
      const msg = `This is your new Credentials ${sendResetTo[0].toUpperCase() + sendResetTo.slice(1)} : ${credId} Password : ${password} .Use this password to log in to your account and change it to a new password`;

      // Sending the message to the user
      const {
          status,
          message
      } = await sendOtpPhone(credId, msg);
      if (status === "failed") res.status(400).send({
          status,
          message
      });
  }
  
  // 8. Sending the response
  res.status(201).send({
      status: "ok",
      message: "Password reset successfully",
  });
});