const bcrypt = require('bcrypt');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Cart = require('../modules/product');
const joi = require('joi');

router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

  router.use(session({
    key: 'user_sid',
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

  router.get('/',(req,res) => {
      if(req.session.user) {
      res.render('Welcome to shopping cart');
      }
      else {
          res.redirect('/');
      }
  });

  router.post('/',(req,res) => {
    
  });

  module.exports = router;