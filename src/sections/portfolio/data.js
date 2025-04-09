import FortuneTrackDesign from "../../assets/FortuneTrack-Design.png";
import FortuneTrackDesignLight from "../../assets/FortuneTrack-Design-Light.png";
import WeatherWisePlus from "../../assets/WeatherWise++.png";
import WeatherWisePlusLight from "../../assets/WeatherWise++-Light.png";
import FortuneTrack from "../../assets/FortuneTrack.png";
import FortuneTrackLight from "../../assets/FortuneTrack-Light.png";
import VuePortfolioDesign from "../../assets/VuePortfolio-Design.png";
import VuePortfolioDesignLight from "../../assets/VuePortfolio-Design-Light.png";
import SnackShackDesign from "../../assets/SnackShack-Design.png";
import SnackShackDesignLight from "../../assets/SnackShack-Design-Light.png";
import VuePortfolio from "../../assets/VuePortfolio.png";
import VuePortfolioLight from "../../assets/VuePortfolio-Light.png";
import AuraArtistry from "../../assets/AuraArtistry.png";
import AuraArtistryLight from "../../assets/AuraArtistry-Light.png";
import WeatherWise from "../../assets/WeatherWise.png";
import WeatherWiseLight from "../../assets/WeatherWise-Light.png";
import TimeScape from "../../assets/TimeScape.png";
import TimeScapeLight from "../../assets/TimeScape-Light.png";

const data = [
  {
    id: 1,
    category: "UI/UX",
    image: FortuneTrackDesign,
    imageLight: FortuneTrackDesignLight,
    title: "FortuneTrack - Design",
    desc: "Created a comprehensive financial analytics UI in Figma, featuring a component-based design system with custom charts and interactive dashboards. Implemented professional blues in the color scheme while utilizing Figma's advanced features including auto-layout, component variants, and prototyping capabilities to deliver an intuitive interface for complex financial data visualization.",
    demo: "https://www.figma.com/design/HXmTERwjHOYsptklvTHAkW/FortuneTrack-Capstone?node-id=28-248&t=zu6TKAQspc9W5rYt-1",
    github: null,
  },
  {
    id: 2,
    category: "Front-End",
    image: WeatherWisePlus,
    imageLight: WeatherWisePlusLight,
    title: "WeatherWise ++",
    desc: "Developed an interactive weather map application using React and React Leaflet that allows users to explore real-time weather data through map clicks or city searches. Implemented features including geolocation, dark mode, API integration, and state management while ensuring responsive design and robust error handling for seamless cross-device experiences.",
    demo: "https://weather-wise-plus.vercel.app/",
    github: "https://github.com/SimanyeSTS/weather-map-app.git",
  },
  {
    id: 3,
    category: "Back-End",
    image: FortuneTrack,
    imageLight: FortuneTrackLight,
    title: "FortuneTrack",
    desc: "Architected an AI-driven stock market analysis platform using the MEVN stack with focus on the Node.js and Express.js backend connected to MySQL. Implemented JWT authentication, role-based access control, and API integrations with Alpha Vantage and Gemini AI. Built automated data update systems with cron jobs and configured CI/CD pipelines via GitHub Actions. Designed the system architecture for scalability with planned AWS Lambda migration.",
    demo: "https://fortunetrack-91faa.web.app/",
    github: "https://github.com/SimanyeSTS/FortuneTrack.git",
  },
  {
    id: 4,
    category: "UI/UX",
    image: VuePortfolioDesign,
    imageLight: VuePortfolioDesignLight,
    title: "VueJS Portfolio - Design",
    desc: "Designed a sophisticated developer portfolio UI in Figma with a dark theme and vibrant accent colors for optimal information hierarchy. Built a consistent component system across portfolio sections (projects, skills, contact) while incorporating Vue.js-inspired design patterns. Developed responsive layouts with thoughtful micro-interactions and a carefully crafted typographic system that balances modern aesthetics with functional information architecture.",
    demo: "https://www.figma.com/design/uRPLAZmDEjBFdNfsV74CbQ/Vue.js-Portfolio?node-id=0-1&t=JzEQBtWXPlSvGXcX-1",
    github: null,
  },
  {
    id: 5,
    category: "UI/UX",
    image: SnackShackDesign,
    imageLight: SnackShackDesignLight,
    title: "Snack Shack - Design",
    desc: "Led the responsive design optimization for a fast food app by creating dedicated tablet and mobile frames in Figma. Adapted the established desktop design with appropriate scaling, layout adjustments, and touch-friendly elements to ensure consistent user experience across all devices. Collaborated effectively within a design team to maintain visual coherence while optimizing for different screen contexts.",
    demo: "https://www.figma.com/design/UwJTS7YCLV0X1r3ncT3s3J/Fast-Food-Snack-Shack?node-id=0-1&t=ARl1TFPu8pWz3uoX-1",
    github: null,
  },
  {
    id: 6,
    category: "Front-End",
    image: VuePortfolio,
    imageLight: VuePortfolioLight,
    title: "VueJS Portfolio",
    desc: "Built a dynamic personal portfolio using Vue.js with Vue Router for navigation and Vuex for state management. Developed reusable components including project cards, skill displays, and a contact form. Styled the application using CSS and Bootstrap for responsive layouts and deployed the production build to Firebase hosting.",
    demo: "https://simanye-somdaka-s-portfolio.web.app/",
    github: "https://github.com/SimanyeSTS/finalPortfolio1.git",
  },
  {
    id: 7,
    category: "Back-End",
    image: AuraArtistry,
    imageLight: AuraArtistryLight,
    title: "AuraArtistry",
    desc: "Engineered a RESTful API using Node.js and Express in a partner project, focusing on backend architecture with structured controllers for user and product management. Implemented middleware for error handling and token verification while establishing MySQL database connections for efficient data operations. Created secure authentication systems and full CRUD functionality for products in an e-commerce context.",
    demo: "https://vuejs-frontend-e2fc1.web.app/",
    github: "https://github.com/SimanyeSTS/AuraArtistry-Project.git",
  },
  {
    id: 8,
    category: "Back-End",
    image: WeatherWise,
    imageLight: WeatherWiseLight,
    title: "WeatherWise",
    desc: "Contributed to both frontend and backend development of a weather application, with primary responsibility for optimizing the Python/Flask API. Enhanced backend scalability and efficiency for integrating external weather service data, focusing on streamlined data processing and structuring to deliver current conditions, forecasts, and pollution data to the user interface.",
    demo: "https://weather-wise-sftw-eng.vercel.app/",
    github: "https://github.com/SimanyeSTS/weather_app.git",
  },
  {
    id: 9,
    category: "Front-End",
    image: TimeScape,
    imageLight: TimeScapeLight,
    title: "TimeScape",
    desc: "Created an interactive clock application using HTML, CSS, and JavaScript featuring smooth animations that accurately display real-time hours, minutes, and seconds. Implemented a modern interface with gradient backgrounds and circular design elements while ensuring responsive behavior across different screen sizes.",
    demo: "https://clock-work-three.vercel.app/",
    github: "https://github.com/SimanyeSTS/clockWork.git",
  },
];

export default data;