require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session')
const SECRET_SESSION = process.env.SECRET_SESSION
const passport = require('./config/ppConfig')
const flash = require('connect-flash')

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);


// secret: what we are actually giving the user to use for our site
// resave: save session even if modified, make this false
//saveUninitialized: if we have a new session, we will save it, make this true
app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))
// init passport and run session on middleware
app.use(passport.initialize())
app.use(passport.session())

//flash for temp messages to the user
app.use(flash())

//middleware to have our message accessible for every view
app.use((req, res, next) => {
  //before every route, will attach current user to res.local
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/', (req, res) => {
  res.render('index', { alert: req.flash() });
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

module.exports = server;
