const _ = require("lodash");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const { User } = require("../modules/module");
const { Product } = require("../modules/product");
const Cart = require("../modules/cart");
const joi = require("joi");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.use(function(req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

router.use(cookieParser());

router.use(
  session({
    key: "user_sid",
    secret: "somerandomstuff",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      expires: 90000000
    }
  })
);

router.use((req, res, next) => {
  res.locals.login = req.session.user;
  res.locals.session = req.session;
  next();
});

router.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.render("index", { title: "Welcome to Mohit Shop" });
  }
});

router.get("/user/signin", function(req, res) {
  if (!req.session.user) {
    res.render("user/signin", {});
  } else {
    res.redirect("/dashboard");
  }
});

router.get("/user/signup", function(req, res) {
  if (!req.session.user) {
    res.render("user/signup", {});
  } else {
    res.redirect("/dashboard");
  }
});

router.get('/user/account',function(req,res){
    if(req.session.user) {
        res.render('user/account',{title: "please fill your personal details"})
          }
          else {
              res.redirect('/dashboard');
          }
  });

router.post("/api/auth", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  var user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .render("user/signin", { error: "Invalid email or password." });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .render("user/signin", { error: "Invalid email or password." });

  req.session.user = user;
  res.redirect("/dashboard");
});

router.get("/dashboard", async (req, res) => {
  if (req.session.user) {
    Product.find(function(err, docs) {
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize) {
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      res.render("user/profile", { products: productChunks });
    });

  } else {
    res.redirect("/");
  }
});

router.get("/add-to-cart/:id", async (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect("/");
  });
});

router.get('/shopping-cart', (req,res,next) => {
  if(!req.session.cart) {
   return res.render('user/shopping-cart', {products: null});
  }
  else {
    
    var cart = new Cart(req.session.cart);
    res.render('user/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
  
}
});

router.get('/reduce/:id', function(req,res,next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req,res,next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/checkout', (req,res,next) => {
  if(!req.session.cart) {
    return res.redirect(req.session.cart);
  }
  else {
    var cart = new Cart(req.session.cart)
    res.render('user/checkout', {total: cart.totalPrice});
  }
});

router.get('/success', (req,res,next) => {
  if(!req.session.cart) {
    return res.redirect(req.session.cart);
  }
  else
  {
    var cart = new Cart(req.session.cart)
    req.session.cart = null; 
    res.render('user/success', {success: 'Your order has been placed successfully!'});
  }
});

router.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.redirect("/dashboard");
  } else {
    res.redirect("/");
  }
});

function validate(user) {
  const schema = {
    email: joi.string().required(),
    password: joi.string().required()
  };
  return joi.validate(user, schema);
}

module.exports = router;
