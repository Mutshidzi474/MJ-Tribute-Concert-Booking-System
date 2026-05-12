const { Router } = require("express");

const isLoggedIn=(req,res,next)=>{
    if(req.session && req.session.userId){
        return next();
    }
    res.redirect('/auth/login');
};

const isAdmin=(req,res,next)=>{
    if(req.session && req.session.role==='admin'){
        return next();
    }
    res.status(403).render('error',{message:'Access denied. Admins only!!'});
};

module.exports={isLoggedIn,isAdmin};

//Validation middleware for user registration
const validateUserRegistration=[
    //Validation for username
    body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({min:3})
    .withMessage("Username must be at least 3 characters long"),

    //Validation for email
    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

    //Validation for password
    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min:6})
    .withMessage("Password must be at least 6 characters long")
];


