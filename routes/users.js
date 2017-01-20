//user routes
const
  express = require('express'),
  passport = require('passport'),
  userRouter = express.Router(),
  User = require('../models/User.js')

userRouter.route('/login')
  .get((req, res) => res.render('login', {message: req.flash('loginMessage')}))
  .post(passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

userRouter.route('/signup')
  .get((req, res) => res.render('signup', {message: req.flash('signupMessage')}))
  .post(passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
  }))

// userRouter.get('/profile', isLoggedIn, (req, res) => {
//   res.redirect('../views/pages/home', {user: req.user})
// })

userRouter.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})




function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  req.flash('loginMessage', 'You must be logged in to see that.')
  res.redirect('/login')
}

module.exports = userRouter
