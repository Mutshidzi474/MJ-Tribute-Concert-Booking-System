const {hashPassword,comparePassword}=require('../config/hash');
const User=require('../models/User');

const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        //check if user exists in the database
        const existingUser=await User.findOne({email});
        if(existingUser){return res.render('register', {error:'Email already registered'});}

        const hashed=await hashPassword(password);
        const newUser=new User({
            name,
            email,
            password:hashed,
            role:'user'
        });

        await newUser.save();
        res.redirect('/auth/login');
        
    }catch(error){
        console.error(error);
        res.status(500).render('register',{error:'Registration failed!'});
    }
};

const loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!User){return res.render('login',{error:'Invalid email or password'});}

        if (!user) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        const isMatch = await comparePassword(password, user.password);
        if(!isMatch){return res.render('login',{error:'Invalid email or password'});}

        req.session.userId = user._id;
        req.session.user = {
            name: user.name,
            email: user.email,
            role: user.role
        };
        req.session.role = user.role;

        if(user.role==='admin'){return res.redirect('/admin/dashboard');}//redirect login to admin dashboard if user role is admin
        res.redirect('/dashboard');
    }catch(error){
        console.error(error);
        res.status(500).render('login',{error:'Login failed!'});
    }
};

const logoutUser=(req,res)=>{
    req.session.destroy((error)=>{
        if(error){return res.status(500).render('rendor',{message:'Logout failed'});}
        res.redirect('/auth/login');
    });
};

module.exports={registerUser,loginUser,logoutUser};
