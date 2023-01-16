const connectdb = require("../utils/connectdb");
const User = require("../models/user.model");
const Product = require("../models/product.model");

let testUserId;
let product;

const populateDb = async () => {
	try {
		await connectdb("mongodb://localhost:27017/auctionDB");
		const user = new User({
			firstName: "John",
			lastName: "Doe",
			role: "ROLE_USER",
			email: "somedummyemail@gmail.com", // should be unique
			password: "12345678",
			phoneNumber: "7654897671", // should be unique
			verified: true,
			dob: "2000-01-01",
		});

		await user.save();
		testUserId = user._id;

		const images = [
			{
				path: "https://res.cloudinary.com/dqw9l9khp/image/upload/v1656514108/AuctionApp/book_l3u5mj.jpg",
				filename: "AuctionApp/12fer45tf",
			},
		];

		for (let i = 0; i < 18; i++) {
			product = new Product({
				title: "You are not so smart.",
				description: "You are not so smart. - David Macreny",
				basePrice: 100,
				images,
				startTime: new Date(),
				duration: 10,
				category: "books",
				auctionStatus: true,
				user: testUserId,
			});

			await product.save();
			console.log(`Product ${i + 1} of ${20} saved`);
		}
		process.exit(0);
	} catch (e) {
		console.log(e);
	}
};

// populateDb();

const pruneDb = async () => {
	try {
		await connectdb("mongodb://localhost:27017/auctionDB");
		await Product.deleteMany({});
		await User.deleteMany({});
		console.log("All users and products deleted");
		process.exit(0);
	} catch (e) {
		console.log(e);
	}
};

// pruneDb();