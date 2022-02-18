require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

// User database object
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

// Test imports
const product = require('./product');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Home route
app.route("/").get((req, res) => {
  res.render("home", { product });
});

// Login Route
app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    console.log(req.body);
  });

// Signup Route
app
  .route("/signup")
  .get((req, res) => {
    const message = "";
    res.render("signup", { message });
  })
  .post((req, res) => {
    console.log(req.body);

    const { fName, lName, email, password } = req.body;

    User.findOne({ email: email }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          res.redirect("/login");
        } else {
          const newUser = new User({
            firstName: fName,
            lastName: lName,
            email: email,
            password: password,
          });

          newUser.save((err) => {
            if (!err) {
              res.redirect("/");
            } else {
              res.send(err);
            }
          });
        }
      } else {
        console.log(err);
      }
    });
  });

// Product Route
app.route('/product/:id')
.get((req, res)=>{
  const { id } = req.params;
  const item = product.find(item => item.id === Number(id));
  res.render('product', { item });
})

// Bid Route
app.route('/bid/:id')
.get((req, res)=>{
  res.send("Bid Route");
})
.post((req, res)=>{

  const { id: productId } = req.params;
  const { bid: bidAmount } = req.body;

  console.log(productId, bidAmount);

  res.redirect(`/product/${productId}`);
})

// Default Route if page not exists
app.route("*").get((req, res) => {
  res.send("ERROR 404");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});