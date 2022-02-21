const { use } = require('express/lib/application');
const mongoose = require('mongoose');
const User = require('../models/User');

const { users } = require('./users');

mongoose.connect('mongodb://localhost:27017/auctionDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', ()=>{
  console.log("connected to local db");
});

User.insertMany(users)