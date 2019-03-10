const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {Account, validate} = require('../modules/user-account');
const mongoose = require('mongoose');
const {User} = require('../modules/module');

router.post('/', async(req,res) => {

    const{ error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    let user = await User.findOne({email:req.body.email});
   if(!user) return res.status(400).render('user/account', {error:'User with this email does not exists'});

   let account = await Account.findOne({email:req.body.email});
   if(account) return res.status(400).render('user/account', {error:'Details of this email has already saved'});
 

     account = new Account(_.pick(req.body,['name','phone','email','address','state','city','code']));
    account = await account.save();

    req.session.account = account;

    res.render('user/account',{success: 'Your Details have been saved'});
});

router.get('/details', (req,res) => {
    if(!req.session.account) {
    Account.find({}).then(account => {
         res.render('user/details',{account: account});
    });
}
else {
    res.redirect('/dashboard');
}
});

module.exports = router;