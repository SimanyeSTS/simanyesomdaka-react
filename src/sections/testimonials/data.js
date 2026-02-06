import CPUT from "../../assets/CPUT.png";
import LCA from "../../assets/LCA.png";
import OHS from "../../assets/OHS.png";
import InuGrp from "../../assets/Inuversal.jpg";
import Beeline from "../../assets/Beeline.png";
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
      qualification: "Coding Course (Full-Stack)",
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
      company: "InUversal Group",
      image: InuGrp,
      position: "Software Developer Intern",
      year: "January 2026 - Present",
      description: 
        "• Architect scalable backend microservices using .NET 10 and Azure for the InUTech ecosystem.\n• Drive mobile engineering using React Native (Expo/Redux) and manage App Store/Play Store releases.\n• Optimize CI/CD pipelines and cloud infrastructure using Docker, Kubernetes, and Azure DevOps.",
    },
    {
      company: "Beeline",
      image: Beeline,
      position: "Product & QA Intern",
      year: "June 2025 - September 2025",
      description:
        "• Conducted end-to-end QA testing and user journey reviews to ensure a seamless learning platform.\n• Automated high-priority QA flows and built Notion-based dashboards to streamline workflows.\n• Documented user flows and Jobs-To-Be-Done (JTBD) to support clearer product insights.",
    },
    {
      company: "LC Studio",
      image: LCS,
      position: "Software Engineering Intern",
      year: "September 2024 - June 2025",
      description:
        "• Developed Flutter Android apps and worked with cloud-based solutions in an Agile environment.\n• Completed AWS Cloud Practitioner training and advanced Python/C++ coursework.\n• Mentored team members while providing consultation on backend architecture.",
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