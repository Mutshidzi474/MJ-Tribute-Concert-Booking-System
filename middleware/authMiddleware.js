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


