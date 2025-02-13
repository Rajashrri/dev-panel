const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const customerSchema = new mongoose.Schema({
    cust_id:{
        type:String,
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true  
    },
    phone:{
        type:String,
        required:true  
    },
    otp:{
        type:String,
    },
    password:{
        type:String,
        // required:true  
    },
    pic:{
        type:String,
    },
    pic_url:{
        type:String,
    },
    
    status:{
        type:String,
    },
    compname:{
        type:String,
    },address:{
        type:String,
    },description:{
        type:String,
    },
    brand:{
        type:String,
    },
    admintemplate_id:{
        type:String,
    },
    fronttemplate_id:{
        type:String,
    }

});

//imp 
customerSchema.pre('save', async function(next){
   const user = this;
    if(!user.isModified('password')){
            next();
    }
    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_password;
    } catch (error) {
        next(error);
    }
});

customerSchema.methods.comparePassword = async function (password){
  return bcrypt.compare(password, this.password);
}

customerSchema.methods.generateToken = async function () {
 try {
    return jwt.sign({
        usexrId:this.id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
    },
    
    );
 } catch (error) {
    console.error(error);
 }
}; 
customerSchema.methods.generateToken2 = async function () {
    try {
       return jwt.sign({
           usexrId:this.id.toString(),
           email: this.email,
           isAdmin: this.isAdmin,
       },
      
       process.env.JWT_SECRET_KEY1, {
           expiresIn:"30d",
       }
       );
    } catch (error) {
       console.error(error);
    }
    }; 
const Customer = new mongoose.model("customer", customerSchema);
module.exports = Customer;

               