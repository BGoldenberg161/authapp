const express = require('express');
const router = express.Router();
const db = require('../models');
const { response } = require('express');

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
      res.redirect('/')
    } else {
      console.log('Email already exists')
      res.redirect('/auth/signup')
    }
  })
  .catch(err => {
    console.log('Error:', err)
    res.redirect('/auth/signup')
  })
})

module.exports = router;
