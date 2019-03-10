const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const personalSchema = new mongoose.Schema({

    picture: {type:String}
   

});

module.exports = mongoose.model('Personal', personalSchema);


