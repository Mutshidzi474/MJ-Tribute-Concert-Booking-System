const express=require('express');
const session=require('express-session');
const MongoStore=require('connect-mongo').default || require('connect-mongo');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const path=require('path');

dotenv.config();// Loading of the .env file intoprocess.env

const app=express();

//Parsing and Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: process.env.SESSION_SECRET || "devSecret123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

//Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log('MongoDB connected Succesfully'))
    .catch((error)=>console.log(`MongoDB connection Unsuccesful: ${error}`));


app.use('/auth',require('./routes/authRoutes'));

app.use((req, res, next) => {

    res.locals.user = req.session.user || null;

    next();

});

const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/', dashboardRoutes);
app.use('/', require('./routes/bookingRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/', require('./routes/eventRoutes'));
app.use('/', require('./routes/contactRoutes'));

app.get('/', (req, res) => {
    res.render('home');
});

// Route for users management (accessible at /users)
app.get('/users', (req, res, next) => {
    // Check if user is admin
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        const adminMiddleware = require('./middleware/adminMiddleware');
        return adminMiddleware(req, res, () => {
            const {manageUsers} = require('./controllers/adminController');
            manageUsers(req, res);
        });
    }
    // Not admin, redirect to login
    res.redirect('/auth/login');
});

//Server
const port=process.env.PORT || 9100;
app.listen(port,()=>console.log(`Server running on port ${port}`));

//Dear group members, please ensure that the following 3 lines of code remaing at the bottom of the app.js
//after every call for middleware, because express runs from top to bottom for some fun reason.(remove comment when project completed)
const {notFound,errorHandler}=require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

