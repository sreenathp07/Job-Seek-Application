import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobschema.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ Expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const {
      Title,
      Description,
      Category,
      Country,
      City,
      Location,
      FixedSalary,
      SalaryFrom,
      SalaryTo,
    } = req.body;
  
    if (!Title || !Description || !Category || !Country || !City || !Location) {
      return next(new ErrorHandler("Please provide full job details.", 400));
    }
  
    if ((!SalaryFrom || !SalaryTo) && !FixedSalary) {
      return next(
        new ErrorHandler(
          "Please either provide fixed salary or ranged salary.",400
        )
      );
    }
  
    if (SalaryFrom && SalaryTo && FixedSalary) {
      return next(
        new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400
        )
      );
    }
    const PostedBy = req.user._id;
    const jobs = await Job.create({
      Title,
      Description,
      Category,
      Country,
      City,
      Location,
      FixedSalary,
      SalaryFrom,
      SalaryTo,
      PostedBy,
    });
    res.status(200).json({
      success: true,
      message: "Job Posted Successfully!",
      jobs,
    });
  });
  
  export const getMyJobs = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const myJobs = await Job.find({ PostedBy: req.user._id });
    res.status(200).json({
      success: true,
      myJobs,
    });
  });
  
  export const updateJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    let job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("OOPS Job not found.!", 404));
    }
    job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Job Updated successfully!",
    });
  });

  export const deleteJob = catchAsyncError(async(req,res,next)=> {
    const{role} =req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
      }
      const { id } = req.params;
    let job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("OOPS Job not found.!", 404));
    }
    await job.deleteOne();
    res.status(200).json({
      success:true,
      message:"Job deleted successfully!",
    })
    });


    export const getSinglejob=catchAsyncError(async(req,res,next)=>{
      const {id} = req.params;
      try {
        const job =await Job.findById(id);
if (!job){
  return next(new ErrorHandler("Job not found",404))
}
res.status(200).json({
  success:true,
  job
})
      } catch(error) {
        return next(new ErrorHandler("Invalid ID/Cast Error",400))
      }
    });
  