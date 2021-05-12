const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const wrapAsync = require('../utilities/wrapAsync');
const usersController = require('../controllers/users');

router.get('/register', usersController.renderRegisterPage);

router.post('/register', wrapAsync(usersController.registerUser));

router.get('/login', usersController.renderLoginPage);

router.post(
    '/login',
    passport.authenticate('local', {
        failureFlash: true,
        successFlash: 'Welcome back!',
        failureRedirect: '/login',
    }),
    usersController.loginUser
);

router.get('/logout', isLoggedIn, usersController.logoutUser);

module.exports = router;
