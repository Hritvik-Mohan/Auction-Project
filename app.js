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
const AppError = require('./utils/AppError');
const userSchema = require('./schemas/userSchema');

// ! My global variables
let alertMessage = ""

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

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', ()=>{
  console.log("connected to local db");
});

// ! Wrapper functions to check async errors
const wrapAsync = (f) => {
  return function(req, res, next){
    f(req, res, next).catch((err) => next(err));
  }
}

// ! Middleware function to validate user data
const validateUser = (req, res, next) => {
  console.log(req.body);
  const { error } = userSchema.validate(req.body);
  if(error){
    console.log(error);
    const msg = error.details.map(e=>e.message).join(',');
    throw new AppError(msg, 400);
  }
  next();
}

// ! Middleware function to validate age
const validateAge = (req, res, next) => {
  const ageInMilliseconds = new Date() - new Date(req.body.user.dob);
  const age =  Math.floor(ageInMilliseconds/1000/60/60/24/365); 
  if (age<18){
    throw new AppError('Sorry you are underage', 405);
  }
  next();
}
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
  .post(
    validateAge,
    validateUser,
    wrapAsync(async (req, res)=>{
    console.log(req.body.user);
    // * Setting image to undefined if user did not
    // * set his profile pic. undefined will let 
    // * mongoose know to set a default profile pic
    req.body.user.image = req.body.user.image.length === 0 ? 
                          undefined : 
                          req.body.user.image;

    const newUser = new User(req.body.user);
    const savedUser = await newUser.save();

    console.log(savedUser)
    res.redirect('/users');

  }))

app.route('/users/register')
  .get((req, res)=>{
    res.render('users/register');
  })

app.route('/users/login')
  .get((req, res)=>{
    res.render('users/login', { alertMessage });
  })
  .post(async (req, res)=>{
    const { email, password } =  req.body.user;

    const foundUser = await User.findOne({email, password});

    // * Found the user
    if(foundUser){
      res.redirect('/')
    }

    // * If user not found
    alertMessage = "Incorrect email or password !";
    res.render('users/login', { alertMessage })

  })


app.route('/users/:id')
  .get(wrapAsync(async (req, res)=>{
    const user = await User.findById(req.params.id);

    if(!user){
      throw new AppError('Not Found', 404);
    }

    res.render('users/profile', { user });
  }))
  .put(
    validateAge,
    validateUser,
    wrapAsync(async (req, res)=>{

    // * Setting a default image if user did not
    // * set his own image
    req.body.user.image = req.body.user.image.length === 0 ? 
                          'https://i.imgur.com/FPnpMhC.jpeg' : 
                          req.body.user.image;
              
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body.user,
      {new: true, runValidators: true}
    );
    console.log(updatedUser);
    res.redirect(`/users/${updatedUser._id}`);
  }))
  .delete(wrapAsync(async (req, res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  }))

app.route('/users/:id/edit')
  .get(wrapAsync(async (req, res)=>{
    const user = await User.findById(req.params.id);

    if(!user){
      throw new AppError('Not Found', 404);
    }

    res.render('users/edit', { user })
  }))

app.all('*', (req, res, next)=>{
  next(new AppError('Page Not Found', 404));
})

app.use((err, req, res, next)=>{
  const { status=500, message="Something went wrong" } = err;
  res.status(status).send({err, message});
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});