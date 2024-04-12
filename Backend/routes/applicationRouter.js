import express from "express";
import { employerGetAllApplication,
    jobseekerGetAllApplication,
    jobseekerDeleteApplication, 
    postApplication} from "../controllers/applicationcontroller.js";
import { isAuthorized } from "../middlewares/auth.js";



const router=express.Router();

router.get("/jobseeker/getall",isAuthorized,jobseekerGetAllApplication);
router.get("/employer/getall", isAuthorized,employerGetAllApplication);
router.delete("/delete/:id", isAuthorized,jobseekerDeleteApplication);
router.post("/post", isAuthorized,postApplication);
export default router;
