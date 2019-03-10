const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {User, validate} = require('../modules/module');


router.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

router.post('/',async(req,res) => {

    const{ error } = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   let user = await User.findOne({email:req.body.email});
   if(user) return res.status(400).render('user/signup', {error:'User already registered'});

    user = new User(_.pick(req.body,['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
   user = await user.save();
   //res.send(_.pick(user,['_id','name','email']));
    res.render('user/signin',{registered: 'Successfully Registered'});
   
});

router.put('/:id',async(req,res) => {
    const{ error } = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   const user = await User.findByIdAndUpdate(req.params.id, {
       picture: req.body.picture
   }, { new: true});

   if(!user) return res.status(400).send('The user with given id was not found');
   res.send(user);
});

router.delete('/:id', async(req,res) => {
    const user = await User.findByIdAndRemove(req.params.id);

    if(!user) return res.status(400).send('The user with given id was not found');
   res.send(user);
});

router.get('/:id',async(req,res) => {
    const user = await User.findById(req.params.id);

    if(!user) return res.status(400).send('The user with given id was not found');
   res.send(user);
})

module.exports = router;