require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// User database object
const User = require('./models/User')

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(cors());


// Home route
app.route('/')
.get((req, res)=>{
  res.render('home');
})

// Login Route
app.route('/login')
.get((req, res)=>{
  res.render('login')
})
.post((req, res)=>{
  console.log(req.body);
})

app.route('/signup')
.get((req, res)=>{
  const message = ""
  res.render('signup', {message})
})
.post((req, res)=>{
  console.log(req.body);
  let message = "";
  const { fName, email, password } = req.body;

  // TODO
  // This code is crashing the code
  // User.findOne({email: email}, (err, foundOne)=>{
  //   if(foundOne){
  //     message = "User exists with that email"
  //     res.render('signup',  { message })
  //     return;
  //   } else {
  //     console.log(err)
  //     return;
  //   }
  // });

  const newUser = new User({
    firstName: fName,
    email: email,
    password: password
  });

  newUser.save((err) => {
    if (!err) {
        res.redirect('/')
    } else {
        res.send(err);
    }
  });

})

app.route("*")
.get((req, res)=>{
  res.send("ERROR 404");
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})