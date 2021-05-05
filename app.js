const express = require('express');
const session = require("express-session");
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require(__dirname + '/utilities/expressError');
const port = 3000;
const app = express();

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const sessionConfig = {
    secret: "defaultSecret",
    resave: false,
    saveUnintialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session(sessionConfig));
app.use(flash());

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console.error, 'conection error:'));
db.once('open', () => {
    console.log('Database connected');
});


app.use((req, res, next) => {
    // res.locals.success = "hello";
    res.locals.success = req.flash('success');
    // res.locals.error = req.flash('error');
    next();
});

//home page
app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

// error handeling
app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
    console.log("Server on port 3000")
});