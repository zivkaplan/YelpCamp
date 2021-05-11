module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnToURL = req.originalUrl;
        req.flash('error', 'You must be logged in to view this page');
        return res.redirect('/login');
    }
    next();
};
