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
        "• Developing Flutter Android apps and working with cloud-based solutions in an Agile environment.\n• Completed AWS Cloud Practitioner certification and advanced Python/C++ coursework.\n• Mentoring team members while providing consultation on backend architecture.",
    },
    {
      company: "Life Choices Academy",
      image: LCA,
      position: "Full-Stack Developer (Capstone Project)",
      year: "August 2024 - September 2024",
      description:
        "• Built FortuneTrack, an AI stock analysis platform with Vue.js, Node.js, and MySQL.\n• Implemented secure authentication and APIs for real-time financial data visualization.\n• Deployed on Firebase with automated CI/CD workflows via GitHub Actions.",
    },
    {
      company: "The Western Cape Government",
      image: WCG,
      position: "Job Shadowing - Nurse",
      year: "November 2021 - June 2022",
      description:
        "• Assisted clinical staff with patient care, wound dressing, and medication administration.\n• Provided support during night shifts and emergency response situations.\n• Gained practical experience in hospital operations and patient-centered care.",
    },
  ],
};

export default resumeData;