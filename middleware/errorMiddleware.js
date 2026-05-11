const notFound=(req,res,next)=>{
    res.status(404).render('error',{message:`Page not found - ${req.originalUrl}`});
};

const errorHandler=(error,req,res,next)=>{
    console.error(error.stack);
    res.status(error.status || 500).render('error',{message:error.message || 'Something went wrong on our end'});
};

module.exports={notFound,errorHandler};

const {body,validationResult}=require('express-validator');

