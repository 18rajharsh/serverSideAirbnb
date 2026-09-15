// Core module
const path = require('path');

// External Modules
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MONGO_DB_URL = "mongodb+srv://rajharshatwork_db_user:zLX9gLLS8sjdNalU@ivaan.lvj1pi3.mongodb.net/airbnb?appName=Ivaan";
const { MongoStore } = require('connect-mongo');
const multer = require('multer');

// Local Modules
const { authRouter } = require('./routes/authRouter');
const { hostRouter } = require('./routes/hostRouter');
const { storeRouter } = require('./routes/storeRouter');
const errorController = require('./controllers/errors');
const rootDir = require('./utils/pathUtil');

const app = express();

app.use(express.static(path.join(rootDir, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = MongoStore.create({
    mongoUrl: MONGO_DB_URL,
    collectionName: 'sessions'
});

// Catches silent session-store failures (e.g. bad BSON, connection issues)
// that would otherwise fail without you ever knowing.
store.on('error', function (error) {
    console.log('SESSION STORE ERROR:', error);
});

app.use(express.urlencoded());
app.use(session({
    secret: "Airbnb web dev project",
    resave: false,
    saveUninitialized: true,
    store: store,
    stringify: false
}));

// Makes isLoggedIn and user available in EVERY EJS template automatically,
// without having to pass them manually in every res.render() call.
// IMPORTANT: this must be res.locals, not req.* — views can only read
// res.locals or whatever is explicitly passed into res.render().
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.user = req.session.user || {};
    next();
});

app.use(storeRouter);
app.use(authRouter);

app.use('/host', (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
});
app.use('/host', hostRouter);

app.use(errorController.pageNotFound);

const port = 8080;
mongoose.connect(MONGO_DB_URL).then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log(`Server : http://localhost:${port}`);
    });
}).catch((err) => {
    console.log("Error while connecting to MongoDB: ", err);
});