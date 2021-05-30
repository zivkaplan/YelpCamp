if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const localStrategy = require('passport-local');
const expressError = require(__dirname + '/utilities/expressError');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const port = process.env.PORT || 3000;
const app = express();
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/users');

const appConfig = (function () {
    const secret = process.env.SECRET || 'defaultSecret';
    const sessionConfig = {
        name: 'SessConnect',
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            // secure: true,
        },
        store: MongoStore.create({
            mongoUrl: dbUrl,
            touchAfter: 24 * 60 * 60,
            crypto: {
                secret: secret,
            },
        }),
    };
    app.engine('ejs', ejsMate);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(session(sessionConfig));
    app.use(flash());
    app.use(mongoSanitize());

    //helmet
    app.use(helmet());

    const scriptSrcUrls = [
        'https://stackpath.bootstrapcdn.com/',
        'https://api.tiles.mapbox.com/',
        'https://api.mapbox.com/',
        'https://kit.fontawesome.com/',
        'https://cdnjs.cloudflare.com/',
        'https://cdn.jsdelivr.net',
    ];
    const styleSrcUrls = [
        'https://kit-free.fontawesome.com/',
        'https://stackpath.bootstrapcdn.com/',
        'https://api.mapbox.com/',
        'https://api.tiles.mapbox.com/',
        'https://fonts.googleapis.com/',
        'https://use.fontawesome.com/',
        'https://cdn.jsdelivr.net',
    ];
    const connectSrcUrls = [
        'https://api.mapbox.com/',
        'https://a.tiles.mapbox.com/',
        'https://b.tiles.mapbox.com/',
        'https://events.mapbox.com/',
    ];
    const fontSrcUrls = [];

    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", 'blob:'],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    'blob:',
                    'data:',
                    'https://images.unsplash.com/',
                    'https://source.unsplash.com/collection/',
                    'https://res.cloudinary.com/djrifev4q/',
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
            },
        })
    );

    //passport
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
})();

const mongooseConfig = (function () {
    mongoose.set('useFindAndModify', false);

    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console.error, 'conection error:'));
    db.once('open', () => {
        console.log('Database connected');
    });
})();

//middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.path = req.originalUrl || '/';
    next();
});

//routes
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/', userRouter);

//home page
app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404));
});

// error handeling
app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
