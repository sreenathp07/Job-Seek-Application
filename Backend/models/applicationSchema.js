import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please provide your name!"],
        minLength: [3,"Name must contain atleast 3 charecters!"],
        maxLength: [30, "Name cannot exceed 30 charecters!"],
},
email:{
    type:String,
    validator:[validator.isEmail,"Please provide a valid email!"],
    required:[true, "please provide your email!"]
},
coverLetter:{
    type:String,
    required:[true,"please provide your cover letter!"]
},
phone:{
    type:Number,
    required:[true,"please provide your phone number!"]
},
address:{
    type:String,
    required:[true,"please provide your Address!"]
},
resume:{
    public_id:{
    type:String,
    required:true,
},
url:{
    type:String,
    required: true,
},
},
applicantID:{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

role:{
    type:String,
    enum:["Job Seeker"],
    required:true
}
},
employerID:{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

role:{
    type:String,
    enum:["Employer"],
    required:true
    }
},
});

export const Application = mongoose.model("Application",applicationSchema);