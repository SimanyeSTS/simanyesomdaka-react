import React, { useState } from "react";
import data from "./data";
import "./testimonial.css";

const Resume = () => {
  const [selectedEduIndex, setSelectedEduIndex] = useState(0);
  const [selectedExpIndex, setSelectedExpIndex] = useState(0);

  return (
    <section id="resume">
      {}
      <div className="education-section" data-aos="fade-in">
        <h2>Education</h2>
        <p className="subtext">
        Growth is not just about what you learn, but how you apply it to create meaningful change.        </p>
        <div className="education-list">
          <ul className="education-tabs">
            {data.education.map((edu, index) => (
              <li
                key={edu.institution}
                className={selectedEduIndex === index ? "active" : ""}
                onClick={() => setSelectedEduIndex(index)}
              >
                <img
                  src={edu.image}
                  alt="institution logo"
                  loading="lazy"
                  className="institution-logo"
                />
                {edu.institution}
              </li>
            ))}
          </ul>
          <div className="education-details">
            <h3>{data.education[selectedEduIndex].institution}</h3>
            <p className="education-duration">
              {data.education[selectedEduIndex].year}
            </p>
            <p>{data.education[selectedEduIndex].qualification}</p>
          </div>
        </div>
      </div>

      {}
      <div className="experience-section">
        <h2>Work Experience</h2>
        <p className="subtext">
        Every challenge is an opportunity to grow, refine skills, and drive impact.        </p>
        <div className="job-list">
          <ul className="job-tabs">
            {data.experience.map((job, index) => (
              <li
                key={job.company}
                className={selectedExpIndex === index ? "active" : ""}
                onClick={() => setSelectedExpIndex(index)}
              >
                <img
                  src={job.image}
                  alt="company logo"
                  loading="lazy"
                  className="company-logo"
                />
                {job.company}
              </li>
            ))}
          </ul>
          <div className="job-details">
            <h3>
              {data.experience[selectedExpIndex].position}{" "}
              <span>@ {data.experience[selectedExpIndex].company}</span>
            </h3>
            <p className="job-duration">
              {data.experience[selectedExpIndex].year}
            </p>
            <p>{data.experience[selectedExpIndex].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;