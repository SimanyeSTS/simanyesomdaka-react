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
        "• Upgraded 50% of microservices to .NET 10, refactoring package dependencies and DevOps pipelines.\n• Drive React Native (Expo) mobile engineering and manage App Store/Play Store deployments.\n• Architected custom Zenoti forms, reducing software dependencies and saving R80,000 - R100,000.\n• Authored comprehensive data dictionaries and technical specifications for custom CRM and GA4 integration.",
    },
    {
      company: "Beeline",
      image: Beeline,
      position: "Product & QA Intern",
      year: "June 2025 - September 2025",
      description:
        "• Headed the ADAPT bug prioritization workflow, refining the team Playbook to optimize sprint capacity.\n• Served as Support DRI during Agile sprints, accelerating resolution times and reducing queues.\n• Built internal workspace databases and operational progress tracking dashboards inside Notion.\n• Assisted with automated regression testing scripts for core user journeys to reduce manual gates.",
    },
    {
      company: "LC Studio",
      image: LCS,
      position: "Software Engineering Intern",
      year: "September 2024 - June 2025",
      description:
        "• Scaled the frontend development team from a solo engineer to an Agile squad of 8 interns.\n• Spearheaded codebase setup and app shell development for a native Flutter Android app.\n• Partnered with backend team to implement database views and caching, reducing load times by 30%.\n• Provided cloud infrastructure consultation, evaluating strategies for AWS Lambda, S3, Docker, and Kubernetes.",
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