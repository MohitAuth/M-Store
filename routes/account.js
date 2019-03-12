const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {Account, validate} = require('../modules/user-account');
const mongoose = require('mongoose');
const {User} = require('../modules/module');

router.post('/', async(req,res) => {

    const{ error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

   let account = await Account.findOne({phone:req.body.phone});
   if(account) return res.status(400).render('user/account', {error:'Details of this account has already saved'});
 

     account = new Account(_.pick(req.body,['phone','address','state','city','code']));
    account = await account.save();

    req.session.account = account;

    res.render('user/account',{success: 'Your Details have been saved'});
});

router.get('/details', (req,res) => {
    if(req.session.user) {
   
         res.render('user/details');
}
else {
    res.redirect('/');
}
});

module.exports = router;