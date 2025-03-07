import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide your name"],
        minLength: [3, "Name must contain at least 3 charecters!"],
        maxLength:[30, "Name cannot exceed 30 charecters!"],
    },
    email:{
        type:String,
        required:[true,"please provide your email"],
        validate:[validator.isEmail,"please provide a valid email!"],
    },
    phone:{
        type:Number,
        required:[true,"please provide your phone number"]
    },
password:{
    type:String,
    required:[true,"please provide your password"],
minLength:[8,"password must contain atleast 8 charecters"],
maxLength:[32,"password cannot exceed 32 charecters"],
select:true
},
role:{
    type:String,
    required:[true, "please provide your role"],
    enum:["Job Seeker","Employer"],
},
createdAt: {
    type:Date,
    default:Date.now,
},

});
 
//HASHING THE PASSWORD
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

//COMPARE PASSWORD
userSchema.methods.comparePassword =async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

  //GENERATING A JWT TOKEN FOR AUTHORISATION
  userSchema.methods.getJWTToken =function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    })

  }   

  export const User = mongoose.model("User",userSchema)