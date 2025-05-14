import CPUT from "../../assets/CPUT.png";
import LCA from "../../assets/LCA.png";
import OHS from "../../assets/OHS.png";
import LCS from "../../assets/LCS.png";
import WCG from "../../assets/WCG.png";

const resumeData = {
  education: [
    {
      institution: "Cape Peninsula University of Technology",
      image: CPUT,
      year: "January 2025 - Present",
      qualification: "Diploma in ICT: Applications Development",
    },
    {
      institution: "Life Choices Academy",
      image: LCA,
      year: "April 2024 - September 2024",
      qualification: "Full-Stack Web Development Bootcamp",
    },
    {
      institution: "Oaklands High School",
      image: OHS,
      year: "January 2019 - December 2023",
      qualification: "National Senior Certificate",
    },
  ],
  experience: [
    {
      company: "LC Studio",
      image: LCS,
      position: "Software Engineering Intern",
      year: "September 2024 - Present",
      description:
        "Gained experience in cloud computing, backend architecture, and frontend development; completed AWS Cloud Practitioner, Python, and C++ courses; provided consultative insights on backend solutions. Currently leading Flutter-based Android development while mentoring teammates and fostering collaboration in an Agile environment.",
    },
    {
      company: "Life Choices Academy",
      image: "https://i.postimg.cc/g2wJXtJ9/LC.png",
      position: "Full-Stack Developer (Capstone Project)",
      year: "August 2024 - September 2024",
      description:
        "Built FortuneTrack, an AI-driven stock market analysis platform using Vue.js, Node.js, and MySQL. Implemented JWT authentication, RESTful APIs for real-time financial data, and interactive visualizations. Deployed on Firebase with GitHub Actions automation, delivering comprehensive market insights through responsive dashboards.",
    },
    {
      company: "The Western Cape Government",
      image: WCG,
      position: "Job Shadowing - Nurse",
      year: "November 2021 - June 2022",
      description:
        "Assisted nurses and doctors with patient care, wound dressing, and medication delivery. Provided logistical support and worked night shifts to ensure continuous patient care. Gained hands-on experience in hospital operations and emergency response.",
    },
  ],
};

export default resumeData;