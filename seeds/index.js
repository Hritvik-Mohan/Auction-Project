const mongoose = require('mongoose');
const User = require('../models/user.model');
const Product = require('../models/product.model')

mongoose.connect('mongodb://localhost:27017/auctionDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', ()=>{
  console.log("connected to local db");
});

// User.insertMany(users)

// Product.insertMany(products);

const userId = ['6213cc66d6e6804b2133b298', '6213cc66d6e6804b2133b299', '6214ab8c30c7865c3dfa9214']
const productId = ['6218c034cc34eebd07e54fb3', '6218c034cc34eebd07e54fb4', '6218c034cc34eebd07e54fb5']

const findAndAddUser = async (user_id, prod_id) => {
  const user = await User.findById(user_id); // find user
  const product = await Product.findById(prod_id);

  product.user = user;

  await product.save()
}

// findAndAddUser(userId[2], productId[2]);

const findAll = async () => {
  const products = await Product.find({})
  console.log(products)
}

// findAll()

// for (let i=0; i<3; i++){
//   findAndAddUser(userId[i], productId[i]);
//   console.log(`Progress ${i}/3`);
// }
 
const deleteAllUsers = async () => {
  await User.deleteMany({})
  console.log('All users deleted')
}

const deleteAllProducts = async () => {
  await Product.deleteMany({})
  console.log('All products deleted')
}

deleteAllUsers()
deleteAllProducts()