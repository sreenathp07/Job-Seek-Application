import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js"
import { Application } from "../models/applicationSchema.js";
import cloudinary from 'cloudinary';
import { Job } from "../models/jobschema.js";


export const employerGetAllApplication =catchAsyncError(async(req,res,next)=>{
    const {role} = req.user; 
    if (role === "Job Seeker") {
        return next(
          new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
        }
        const {_id} =req.user;
        const applications = await Application.find({"employerID.user":_id});
        res.status(200).json({
            success:true,
            applications,
        })
}) 

export const jobseekerGetAllApplication =catchAsyncError(async(req,res,next)=>{
    const {role} =req.user;
    if (role === "Employer") {
        return next(
          new ErrorHandler("Employer not allowed to access this resource.", 400)
        );
        }
        const {_id} =req.user;
        const applications = await Application.find({'applicantID.user':_id});
        res.status(200).json({
            success:true,
            applications
        })
});
 export const jobseekerDeleteApplication = catchAsyncError(async(req,res,next)=>{
    const{role}=req.user;
        if (role === "Employer") {
            return next(
              new ErrorHandler("Employer is not allowed to access this resource!", 400)
            ); 
            }
            const {id} =req.params;
            const applications = await Application.findById(id);
            if(!applications){
                return next(
                    new ErrorHandler("Oops,Application not found!", 400)
                  );
            }
           await applications.deleteOne();
           res.status(200).json({
            success:true,
            message:"Application Deleted Successfully!",
           }) 
    });
 
export const postApplication = catchAsyncError(async(req,res,next) =>{
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer is not allowed to access this resource!", 400)
    ); 
    }
if (!req.files || Object.keys(req.files).length === 0) {
  return next(new ErrorHandler("Resume File Required!",400));
}
const { resume } = req.files;
const allowedFormats  = ["image/png","image/jpeg","image/webp"];
if(!allowedFormats.includes(resume.mimetype)){
  return next(new ErrorHandler("Invalid file type. Please upload your resume in a PNG,JPG OR WEB Format.",400))
}
const cloudinaryResponse = await cloudinary.uploader.upload(
  resume.tempFilePath
);

if(!cloudinaryResponse || cloudinaryResponse.error){
  console.error("cloudinary Error:",
  cloudinaryResponse.error || "Unknown cloudinary Error"
  );
  return next(new ErrorHandler("Failed to upload resume to cloudinary. ",500))
}
const { name, email, coverLetter, phone, address, jobID} = req.body;
const applicantID ={
  user: req.user._id,
  role:"Job Seeker", 
};
if (!jobID){
  return next(new ErrorHandler("Job not found!",404));
}
const jobDetails = await Job.findById(jobID);
if(!jobDetails){
  return next(new ErrorHandler("Job not found",404));
}

const employerID = {
  user: jobDetails.PostedBy,
  role:"Employer",
};
if(
  !name || 
  !email||
  !coverLetter||
  !phone||
  !address||
  !applicantID||
  !employerID||
  !resume
  ){
    return next(new ErrorHandler("Please fill all field!",400));

  }
const application = await Application.create({
  name , 
  email,
  coverLetter,
  phone,
  address,
  applicantID,
  employerID,  
  resume:{
    public_id:cloudinaryResponse.public_id,
    url:cloudinaryResponse.secure_url,
  },
})
res.status(200).json({
  success:true,
  message:"Application Submitted!",
  application,
})
 })
