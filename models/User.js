// User schema

const userSchema=new mongoose.Schema({
    UserID:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,default:'user'}
});

const User=mongoose.model('User',userSchema);

module.exports=mongoose.model('User',userSchema);