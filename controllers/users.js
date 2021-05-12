const User = require('../models/user');

module.exports.renderRegisterPage = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginPage = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = (req, res) => {
    const userLastPage = req.session.returnToURL;
    delete req.session.returnToURL;
    res.redirect(userLastPage || '/campgrounds');
};

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'Logged out');
    res.redirect('/campgrounds');
};
