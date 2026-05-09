const express=require('express');
const router=express.Router();
const {registerUser,loginUser,logoutUser}=require('../controllers/authController');

router.get('/register',(req,res)=>res.render('register',{error:null}));
router.get('/login',(req,res)=>res.render('login',{error:null}));

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);

module.exports=router;
