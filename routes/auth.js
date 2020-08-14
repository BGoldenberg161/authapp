const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig')

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/signup', (req, res)=>{
  console.log(req.body)
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user, created]) => {
    if(created){
      console.log(`${user.name} was created`)
      // Flash Message
      passport.authenticate('local', {
        successRedirect: '/', 
        successFlash: 'Account created and logging in...'
      }) (req, res)
      // res.redirect('/')
    } else {
      console.log('Email already exists')
      // Flash
      req.flash('error', 'Email already exists, please try again.')
      res.redirect('/auth/signup')
    }
  })
  .catch(err => {
    console.log('Error:', err)
    req.flash('errror', `Error, too bad you gotta be a dev for it to help you... ${err}`)
    res.redirect('/auth/signup')
  })
})

//FLASH message
router.post('/login', passport.authenticate('local', {
  successRedirect: '/', 
  failureRedirect: '/auth/login',
  successFlash: 'Welcome back!',
  failureFlash: 'Either email or password incorrect, please try again'
}))


router.get('/logout', (req, res)=>{
  req.logOut()
  req.flash('success', 'Thank you, come again... Apu')
  res.redirect('/')
})

module.exports = router;
