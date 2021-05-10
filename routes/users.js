const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const User = require('../models/user');
const wrapAsync = require('../utilities/wrapAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post(
    '/register',
    wrapAsync(async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        } catch (err) {
            req.flash('error', err.message);
            res.redirect('/register');
        }
    })
);

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post(
    '/login',
    passport.authenticate('local', {
        failureFlash: true,
        successFlash: 'Welcome back!',
        failureRedirect: '/login',
    }),
    (req, res) => {
        res.redirect('/campgrounds');
    }
);

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    req.flash('success', 'Logged out');
    res.redirect('/campgrounds');
});

module.exports = router;
