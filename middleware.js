module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You are not currently signned in');
        return res.redirect('/login');
    }
    next();
};
