import mongoose from "mongoose";

 const jobschema = new mongoose.Schema({
    Title:{
        type:String,
        required: [true, "please provide job title"],
        minLength:[3, "job title must contain atleast 3 charecters!"],
        maxLength:[50,"job title can't exceed 50 characters"],
    },
    Description:{
        type:String,
        required:[true,"please provide job description"],
        minLength:[3, "job description must contain atleast 3 charecters!"],
        maxLength:[100,"job description can't exceed 50 characters"],
    },
    Category:{
        type:String,
        required:[true,"job category is required "],
    },
   Country:{
        type:String,
        required:[true,"job country is required "],
   },
   City:{
    type:String,
    required:[true,"job city is required "],
   },
   Location:{
    type:String,
    required:[true,"job location is required "],
    minLength:[10, "job location must contain atleast 10 charecters!"],
   },
   FixedSalary: {
type:Number,
minLength:[4, "fixed salary must contain atleast 4 digits!"],
maxLength:[9,"fixed salary cannot exceed 9 digits!"],
   },
   SalaryFrom:{
    type:Number,
    minLength:[4,"Salary From must contain atleast 4 digits!"],
    maxLength:[9,"Salary From cannot exceed 9 digits!"],
   },
   SalaryTo:{
    type:Number,
    minLength:[4,"Salary To must contain atleast 4 digits!"],
    maxLength:[9,"Salary To cannot exceed 9 digits!"],
   },
   Expired:{
    type:Boolean,
    default:false,
   },
   JobPostedOn:{
    type:Date,
    default:Date.now,
   },
   PostedBy:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required: true,
   },

})

export const Job = mongoose.model("Job", jobschema)