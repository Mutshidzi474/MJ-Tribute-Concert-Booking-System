const bcrypt=require('bcryptjs'); // importing bcryptjs for password hashing and comparison
const hashPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
};
const comparePassword=async(plainPassword,hashedPassword)=>{return await bcrypt.compare(plainPassword,hashedPassword)};

module.exports={hashPassword,comparePassword};
