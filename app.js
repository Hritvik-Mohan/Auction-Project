/**
 * Node Modules Imports
 */
const express = require("express");
const path = require("path");
const cors = require("cors");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");
const coookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

/**
 * Configs Imports.
 */
const { sessionConfig } = require("./configs/config");

/**
 * Utils Imports
 */
const connectDb = require("./utils/connectDb");
const AppError = require("./utils/AppError");
const getCurrentUser = require("./utils/getCurrentUser");

/**
 * Router imports
 */
const UserRouter = require("./routes/user/user.router");
const ProductRouter = require("./routes/product/product.router")
const StripeRouter = require("./routes/stripe/stripe.router");
const WebhookRouter = require("./routes/stripe/webhook.router");

/**
 * Declarations
 */
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middlewares
 */
// Listen for incoming webhook requests 
app.use("/", WebhookRouter);
// ------------------------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(methodOverride('_method'));
app.use(coookieParser(process.env.SIGN_COOKIE));
app.use(morgan("dev"));
app.use(session(sessionConfig));
app.use(flash());
/**
 * Setting global variables
 */
 app.use(async (req, res, next)=>{
  res.locals.currentUser = await getCurrentUser(req, res);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

/**
 * Routes middleware
 */
app.use("/", UserRouter);
app.use("/", ProductRouter);
app.use("/", StripeRouter);

/**
 * Home route.
 */
app.route("/").get((req, res) => {
  res.render("home");
});

/**
 * If none of the routes matches.
 */
app.all('*', (req, res, next)=>{
  next(new AppError('Page Not Found', 404));
})

/**
 * Default error handling middleware.
 */
app.use((err, req, res, next)=>{
  const { status=500, message="Something went wrong", stack } = err;
  res.status(status).send({err, message, stack});
})

const runServer = async () =>{
  if(process.env.NODE_ENV !== "production"){
    await connectDb();
    app.listen(PORT, ()=>{
      console.log(`Development server live on http://localhost:${PORT}`);
    })
  } else {
    await connectDb(process.env.MONGODB_CONNECTION_STRING);
    app.listen(PORT, ()=>{
      console.log(`Production server live on port ${PORT}`);
    })
  }
}

runServer();