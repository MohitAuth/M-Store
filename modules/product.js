const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const productSchema = new mongoose.Schema({

    imagePath: {type:String, required:true},
    title: {type:String, required:true},
    price: {type:String, required:true}

});

var Product = mongoose.model('Product', productSchema);

async function shop() {
const product = new Product({
  
    imagePath:"https://dressabellecomsg.cdn.sg/images/stories/virtuemart/product/resized/dress126_400x800.jpg",
    title: 'Tassel Tie Front Dress',
    price: 40
});



//const result = await product.save();
//console.log(result);

}
shop();

exports.Product = Product;