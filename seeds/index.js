const mongoose = require('mongoose');
const Campground = require('../models/campground');
const User = require('../models/user');
const passport = require('passport');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console.error, 'conection error:'));
db.once('open', () => {
    console.log('Database connected');
});

function randomInt(n) {
    return Math.floor(Math.random() * n);
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    await User.deleteMany({});

    const user = new User({ username: 'Tim', email: 'tim@tim.com' });
    const defaultUser = await User.register(user, 'tim');

    for (let i = 0; i < 200; i++) {
        const randomNum = randomInt(1000);

        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            images: [
                {
                    url: 'https://source.unsplash.com/collection/483251',
                    filename: 'unsplash',
                },
            ],
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae tortor condimentum lacinia quis vel eros. Ultrices dui sapien eget mi. Vel facilisis volutpat est velit egestas dui. Mus mauris vitae ultricies leo.',
            price: randomInt(20) + 10,
            author: defaultUser._id,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[randomNum].longitude,
                    cities[randomNum].latitude,
                ],
            },
        });
        await camp.save();
    }
};
const dropReviewsDb = async () => {
    mongoose.connection.dropCollection('reviews', function (err, result) {
        if (result) {
            console.log('Collection dropped');
        } else {
            console.log('Collection Not Found');
        }
    });
};

dropReviewsDb()
    .then(() => {
        return seedDb();
    })
    .then(() => {
        mongoose.connection.close();
        console.log('Database closed');
    });
