if(process.env.NODE_ENV  !="production"){
  require('dotenv').config()
}


const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo'); // connect to mongodb
const flash = require("connect-flash");
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js');

// ----------------- MongoDB Sessions

// const store= MongoStore.create({ 
//   mongoUrl: process.env.ATLASTURL,
//   crypto:{
//     secret:"mysupersececode",
//   },
//   touchAfter:24*3600,
//  });
// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//   async function main() {
//     await mongoose.connect(MONGO_URL);
//   }
//------------------

// store.on("error",()=>{
//     console.log("ERROR In MongoDB Store");
// });

const sessionOption = {
  // store,
  secret:"mysupersececode",
  resave:false,
  saveUnintialized:true,
  cookie:{
    expires: Date.now() + 7 * 24* 60*60*1000,
    maxAge:7 * 24* 60*60*1000,
    httpOnly:true,//help  for cross site scpriting attack
  }
}


app.use(session(sessionOption));
app.use(flash());
// for authentication ------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//---------------------------------------------------------------------------------------


const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const userRouter = require("./router/user.js");


// set connection with Mongoose
main()
  .then(() => {
    console.log("connect to mongoDB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  // await mongoose.connect(process.env.ATLASTURL);
}

// for Using atatic file
app.use(express.static(path.join(__dirname, "/public")));

// use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);

//method override
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

//set ejs path for view dir
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// it use to  handle POST request data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Root Api
app.get("/", (req, res) => {
  res.send("Root work well");
});

// flash success middleware 
app.use((req,res,next)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser= req.user;
  next();
})

//fake SignUp
// app.get("/demouser",async(req,res)=>{
//       let fakeuser= new User({
//             email:"abc@gmail.com",
//             username:"abc123"
//       });

//     const registerUse = await User.register(fakeuser,"abc123");
//     res.send(registerUse)
// });

//define listings
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

//Page Not Found Error
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page  Note Found"))
})

//error haondling middle ware
app.use((err, req, res, next) => {
  let{statusCode=500,message="Something Went Wrong"}=err;
  res.status(statusCode).render("error.ejs",{ err})
  // res.status(statusCode).send(message);
});

// Server SetUp
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
