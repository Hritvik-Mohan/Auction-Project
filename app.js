require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const { stringify } = require('querystring');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

// Database connectivity
const userDB = process.env.MONGO_CONNECTION;

mongoose.connect(userDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const userSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  password: String
});

const User = mongoose.model("user", userSchema);

app.route('/')
.get((req, res)=>{
  res.render('home');
})

app.route('/login')
.get((req, res)=>{
  res.render('login')
})

app.route('/signup')
.get((req, res)=>{
  res.render('signup')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})