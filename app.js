const express=require('express');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const path=require('path');

dotenv.config();// Loading of the .env file intoprocess.env

const app=express();

//Parsing and Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname+'public')));
app.use('view engine'+'ejs');
app.use('views'+path.join(__dirname+'views'));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.createKrupteinAdapter({mongoUrl:process.env.MONGO_URI}),
    cookie:{maxAge:1000*60*60*24}
}));

//Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console,log('MongoDB connected Succesfully'))
    .catch((error)=>console.log(`MongoDB connection Unsuccesful: ${error}`));


//*************************F I L L  I N  R O U T E S  C O D E  H E R E ********************************
//I avoided adding the middleware code here related to the routes for now, will update when routes is finished.



//Dear group members, please ensure that the following 3 lines of code remaing at the bottom of the app.js
//after every call for middleware, because express runs from top to bottom for some fun reason.(remove comment when project completed)
const {notFound,errorHandler}=require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

//Server
const port=process.env.PORT || 3000;
app.listen(port,()=>console.log(`Server running on port ${port}`));



