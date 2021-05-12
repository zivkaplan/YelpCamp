const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const wrapAsync = require('../utilities/wrapAsync');
const usersController = require('../controllers/users');

router
    .route('/register')
    .get(usersController.renderRegisterPage)
    .post(wrapAsync(usersController.registerUser));

router
    .route('/login')
    .get(usersController.renderLoginPage)
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            successFlash: 'Welcome back!',
            failureRedirect: '/login',
        }),
        usersController.loginUser
    );

router.get('/logout', isLoggedIn, usersController.logoutUser);

module.exports = router;
