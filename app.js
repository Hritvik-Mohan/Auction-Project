require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const userDB = process.env.MONGO_CONNECTION;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

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