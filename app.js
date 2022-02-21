const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// ! My imports
const User = require('./models/User');
const AppError = require('./utils/AppError')

// * Local mongo server
mongoose.connect('mongodb://localhost:27017/auctionDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ! Comment out the server you are not using

// ? Online mongo server
// mongoose.connect(process.env.MONGO_CONNECTION, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// ! Wrapper functions to check async errors
const wrapAsync = (f) => {
  return function(req, res, next){
    f(req, res, next).catch((err) => next(err));
  }
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', ()=>{
  console.log("connected to local db");
});

// Home route
app.route("/").get((req, res) => {
  res.render("home");
});

// Users REST Routes

app.route('/users')
  .get( async (req, res)=>{
    const users = await User.find({});
    res.render('users/index', { users })
  })
  .post(wrapAsync(async (req, res)=>{
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    console.log(savedUser)
    res.redirect('/users');
  }))

app.route('/users/register')
  .get((req, res)=>{
    res.render('users/register');
  })

app.route('/users/:id')
  .get(wrapAsync(async (req, res)=>{
    const user = await User.findById(req.params.id);
    console.log(user, req.params.id);
    res.render('users/profile', { user });
  }))
  .put(wrapAsync(async (req, res)=>{
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    console.log(updatedUser);
    res.redirect('/users');
  }))
  .delete(wrapAsync(async (req, res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  }))

app.route('/users/:id/edit')
  .get(wrapAsync(async (req, res)=>{
    const user = await User.findById(req.params.id);
    res.render('users/edit', { user })
  }))

app.all('*', (req, res, next)=>{
  next(new AppError('Page Not Found', 404));
})

app.use((err, req, res, next)=>{
  const { status=500, message="Something went wrong" } = err;
  res.status(status).send(message);
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});