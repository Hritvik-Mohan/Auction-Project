/**
 * Node modules.
 */
const validator = require("validator");

/**
 * Utils imports
 */
const catchAsync = require("../../utils/catchAsync");
const { emailOtpTemplate } = require("../../utils/emailTemplates");
const sendMail = require("../../utils/nodemailer");
const { newToken } = require("../../utils/jwt");
const { dateEighteenYearsAgo } = require("../../utils/misc.functions");
const { cloudinary } = require("../../utils/cloudinaryUpload");

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
module.exports.registerUser = catchAsync(async (req, res) => {
	// 1. Get user data
	const { email, firstName, lastName, password, phoneNumber, dob } = req.body;

	// 2. Check if all the fields are filled.
	if (!email || !firstName || !lastName || !password || !phoneNumber || !dob) {
		await cloudinary.uploader.destroy(req.file.filename);
		req.flash("error", "Please fill all the fields");
		return res.redirect("/users/register");
	}

	// 3. Check if the firstName and lastName are only containing letters.
	if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
		await cloudinary.uploader.destroy(req.file.filename);
		req.flash("error", "Invalid first name or last name");
		return res.redirect("/users/register");
	}

	// 4. Validate the data received.
	if (!validator.isEmail(email)) {
		await cloudinary.uploader.destroy(req.file.filename);
		req.flash("error", "Please enter a valid email");
		return res.redirect("/users/register");
	}

	if (!validator.isMobilePhone(phoneNumber, "en-IN")) {
		await cloudinary.uploader.destroy(req.file.filename);
		req.flash("error", "Please enter a valid phone number");
		return res.redirect("/users/register");
	}

	if (!validator.isBefore(dob, dateEighteenYearsAgo())) {
		await cloudinary.uploader.destroy(req.file.filename);
		req.flash("error", "Age should be 18 years or older");
		return res.redirect("/users/register");
	}

	if (!validator.isLength(password, { min: 6, max: 20 })) {
		await cloudinary.uploader.destroy(req.file.filename);
		req.flash("error", "Password should be between 8 and 20 characters");
		return res.redirect("/users/register");
	}

	// 5. Check if profile picture is uploaded.
	if (!req.file) {
		req.flash("error", "Please upload a profile picture");
		return res.redirect("/users/register");
	}

	const { path, filename } = req.file;

	const avatar = {
		path,
		filename,
	};

	// Default role
	const role = "ROLE_USER";

	// 6. Check if user exists with phone or email
	const existingUser = await User.findOne({
		$or: [
			{
				email,
			}, //Check if this matches
			{
				phoneNumber,
			}, // OR this matches
		],
	});

	if (existingUser) {
		req.flash("error", "An account already exists, head to login");
		return res.redirect("/users/login");
	}

	const user = new User({
		firstName,
		lastName,
		email,
		password,
		phoneNumber,
		dob,
		avatar,
		role,
	});

	const token = newToken(user._id);
	user.tokens.push({ token });
	await user.save();

	// Setting the token in cookies
	res.cookie("token", token, { signed: true });
	req.flash("success", "Welcome to Auction App");

	// Skip through email verification process and redirecting to products page
	if (
		process.env.SKIP_EMAIL_VERIFICATION &&
		process.env.SKIP_EMAIL_VERIFICATION === "true"
	)
		return res.redirect("/products");

	return res.redirect("/users/verification");
});

/**
 * @description - This function is used to verify the user's email by generating
 *                a otp and sending it to the user's email.
 *
 * @param {object} req - contains email and otp
 * @param {object} res - response object
 * @returns undefined
 */
module.exports.sendVerificationOTP = catchAsync(async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	const otp = Math.floor(100000 + Math.random() * 900000);

	user.otp = otp;

	const html = emailOtpTemplate(otp);
	const info = await sendMail(email, "Verify your email", html);

	console.log("SENT_OTP_EMAIL_TEMPLATE",info);

	if (!info) {
		req.flash("error", "Couldn't send mail. Try again later.");
		return res.redirect("/users/verification");
	}

	await user.save();

	// 6. Sending the response
	req.flash(
		"success",
		"OTP sent to your mail. It takes 120sec to receive this mail. Please be patient."
	);
	return res.redirect("/users/confirm");
});

/**
 * @description - This function is used to verify the user's email using the OTP
 *
 * @param {object} req - contains email and otp
 * @param {object} res - response object
 * @returns undefined
 */
module.exports.verifyEmail = catchAsync(async (req, res) => {
	const { email, otp } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		req.flash("error", "Incorrect email");
		return res.redirect("/users/confirm");
	}

	const result = await user.checkOTP(otp);

	if (!result) {
		req.flash("error", "Invalid OTP");
		return res.redirect("/users/confirm");
	}

	user.otp = "";
	user.verified = true;

	await user.save();

	// 8. Sending the response
	req.flash("success", "Email verified successfully");
	return res.redirect("/products");
});

/**
 * @description - This login function checks if the user exists, if yes then
 * checks if the password verifies to the hash. If matched provides a JWT Token
 *
 * @param {object} req contains email and password
 * @param {object} res response object
 * @returns undefined
 */
module.exports.login = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(400).send({
			message: "email and password are required",
		});

	const user = await User.findOne({ email }).exec();

	if (!user) {
		req.flash("error", "Invalid email or password");
		return res.redirect("/users/login");
	}

	const match = await user.checkPassword(password);
	if (!match) {
		req.flash("error", "Invalid email or password");
		return res.redirect("/users/login");
	}

	const token = newToken(user._id);
	user.tokens.push({ token });
	await user.save();

	// Setting the token to the cookies for identifying signed user
	res.cookie("token", token, { signed: true });
	req.flash("success", "Welcome to Auction App");

	// Redirecting to the previous page ---------------------
	let redirectTo = req.session.returnTo || "/products";
	if (redirectTo === "/users/logout") {
		redirectTo = "/products";
	}
	if (redirectTo.endsWith("/bid")) {
		redirectTo = redirectTo.replace("/bid", "").replace("/users", "/products");
	}
	if (redirectTo.endsWith("/logoutAll")) {
		redirectTo = "/products";
	}
	delete req.session.redirectTo;
	console.log(
		"🐞 --------------------------------------------------------------------------------------------------🐞"
	);
	console.log(
		"🐞 ~ file: auth.controller.js ~ line 249 ~ module.exports.login=catchAsync ~ redirectTo",
		redirectTo
	);
	console.log(
		"🐞 --------------------------------------------------------------------------------------------------🐞"
	);

	return res.redirect(redirectTo);
});

/**
 * This logout function clears the jwt token from cookie and hence
 * logs him out.
 *
 * @param {object} req contains email and password
 * @param {object} res response object
 * @returns undefined
 */
module.exports.logout = catchAsync(async (req, res) => {
	res.clearCookie("token");

	req.user.tokens = req.user.tokens.filter((token) => token.token != req.token);
	await req.user.save();

	req.flash("success", "Logged you out. See you again !");
	return res.redirect("/products");
});

module.exports.logoutAll = catchAsync(async (req, res) => {
	res.clearCookie("token");

	req.user.tokens = [];
	await req.user.save();

	req.flash("success", "Logged you out of all the devices.");
	return res.redirect("/products");
});

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
	const { email } = req.body;
	if (!email) {
		req.flash("error", "Email is required");
		return res.redirect("/users/forgot-password");
	}

	// 1. Finding the user with that email.
	const user = await User.findOne({ email });
	if (!user) {
		req.flash("error", "Email is not registered");
		return res.redirect("/users/forgot-password");
	}

	// 2. Generating a 6 digit random number for otp
	const otp = Math.floor(100000 + Math.random() * 900000);

	// 3. Setting the generated otp to the users otp property
	user.otp = otp;

	// 4. Save the user
	await user.save();
	// 5. Sending the otp to the user's email.
	const html = emailOtpTemplate(otp);

	const info = await sendMail(email, "Reset Passoword", html);

	console.log(info);

	if (!info) {
		req.flash("error", "Couldn't send mail. Try again later.");
		return res.redirect("/users/forgot-password");
	}

	// 6. Sending the response
	req.flash("success", "OTP sent to your mail");
	return res.redirect("/users/reset-password");
});

/**
 * @description -  This reset password function checks the email and otp
 * received from the user and if matched then changes the password
 * and sends email to the user with the new password
 *
 * @param {object} req contains email and otp
 * @param {object} res response object
 * @returns undefined
 */
module.exports.resetPassword = catchAsync(async (req, res) => {
	const { email, otp, password } = req.body;

	if (!email || !otp || !password) {
		req.flash("error", "All fields are required");
		return res.redirect("/users/reset-password");
	}

	if (!validator.isEmail(email)) {
		req.flash("error", "Please enter a valid email");
		return res.redirect("/users/reset-password");
	}

	if (!validator.isLength(password, { min: 6, max: 20 })) {
		req.flash("error", "Password length should be between 8 and 20 characters");
		return res.redirect("/users/reset-password");
	}

	// 1. Finding the user with that email.
	const user = await User.findOne({ email });
	if (!user) {
		req.flash("error", "Incorrect email");
		return res.redirect("/users/reset-password");
	}

	// 2. Checking if the otp matches the one in the database
	const result = await user.checkOTP(otp);
	if (!result) {
		req.flash("error", "Invalid OTP");
		return res.redirect("/users/reset-password");
	}

	// 5. Save the new password to the user database
	user.password = password;

	// 6. Clear the otp field from the user database
	user.otp = "";

	// 7. Clear all the tokens from the user database.
	user.tokens = [];

	// 8. Save the user
	await user.save();

	// 8. Sending the response
	req.flash("success", "Password reset successfully");
	return res.redirect("/users/login");
});
