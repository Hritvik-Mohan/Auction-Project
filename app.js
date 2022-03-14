/**
 * Node Modules Imports
 */
const express = require("express");
const path = require("path");
const cors = require("cors");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");

/**
 * Utils Imports
 */
const connectDb = require("./utils/connectDb");

/**
 * Routes imports
 */
const UserRouter = require("./routes/user/user.router");
const ProductRouter = require("./routes/product/product.router")

/**
 * Declarations
 */
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middlewares
 */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(methodOverride('_method'));
app.use(morgan("dev"));

/**
 * Routes middleware
 */
app.use("/", UserRouter);
app.use("/", ProductRouter);

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
  await connectDb();

  app.listen(PORT, () => {
    console.log("Server is live");
    console.log(`Live at http://localhost:${PORT}/`);
  });
}

runServer();