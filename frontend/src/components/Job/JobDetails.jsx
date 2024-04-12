import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, []);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span> {job.Title}</span>
          </p>
          <p>
            Category: <span>{job.Category}</span>
          </p>
          <p>
            Country: <span>{job.Country}</span>
          </p>
          <p>
            City: <span>{job.City}</span>
          </p>
          <p>
            Location: <span>{job.Location}</span>
          </p>
          <p>
            Description: <span>{job.Description}</span>
          </p>
          <p>
            Job Posted On: <span>{job.JobPostedOn}</span>
          </p>
          <p>
            Salary:{" "}
            {job.FixedSalary ? (
              <span>{job.FixedSalary}</span>
            ) : (
              <span>
                {job.SalaryFrom} - {job.SalaryTo}
              </span>
            )}
          </p>
          {user && user.role === "Employer" ? (
            <></>
          ) : (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;