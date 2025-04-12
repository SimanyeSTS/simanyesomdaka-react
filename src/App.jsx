import Navbar from "./sections/navbar/Navbar";
import Header from "./sections/header/Header";
import About from "./sections/about/About";
import Services from "./sections/services/Services";
import Portfolio from "./sections/portfolio/Portfolio";
import Testimonials from "./sections/testimonials/Testimonials";
import FAQs from "./sections/faqs/FAQs";
import Contact from "./sections/contact/Contact";
import Footer from "./sections/footer/Footer";
import FloatingNav from "./sections/floating-nav/FloatingNav";
import Theme from "./theme/Theme";
import CustomAnimatedCursor from "./components/CustomAnimatedCursor";
import { useThemeContext } from "./context/theme-context";
import { useRef, useState, useEffect } from "react";

const App = ({ onLoaded }) => {
  const { themeState } = useThemeContext();
  
  useEffect(() => {
    // Force scroll to top on load and clear any hash
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.location.hash = '';
    }
    
    // Signal that app is loaded
    if (onLoaded) {
      onLoaded();
    }
  }, [onLoaded]);

  useEffect(() => {
    // Update theme color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', `hsl(${themeState.primaryHue}, 89%, 41%)`);
    }
  }, [themeState.primaryHue]);

  useEffect(() => {
    // Update scrollbar colors based on theme
    const root = document.documentElement;
    root.style.setProperty("--scrollbar-thumb-color", `hsl(${themeState.primaryHue}, 89%, 41%)`);
    if (themeState.background === "bg-1") {
      root.style.setProperty("--scrollbar-track-color", "white");
    } else if (themeState.background === "bg-2") {
      root.style.setProperty("--scrollbar-track-color", "black");
    }
  }, [themeState.primaryHue, themeState.background]);

  const mainRef = useRef();
  const [showFloatingNav, setShowFloatingNav] = useState(true);
  const [siteYPostion, setSiteYPosition] = useState(0);

  const showFloatingNavHandler = () => {
    setShowFloatingNav(true);
  };

  const hideFloatingNavHandler = () => {
    setShowFloatingNav(false);
  };

  const floatingNavToggleHandler = () => {
    if (
      siteYPostion < mainRef?.current?.getBoundingClientRect().y - 20 ||
      siteYPostion > mainRef?.current?.getBoundingClientRect().y + 20
    ) {
      showFloatingNavHandler();
    } else {
      hideFloatingNavHandler();
    }
    setSiteYPosition(mainRef?.current?.getBoundingClientRect().y);
  };

  useEffect(() => {
    const checkYPosition = setInterval(floatingNavToggleHandler, 2000);
    return () => clearInterval(checkYPosition);
  }, [siteYPostion]);

  return (
    <>
      <CustomAnimatedCursor />
      <main className={`${themeState.primary} ${themeState.background}`} ref={mainRef}>
        <Navbar />
        <Header />
        <About id="about" />
        <Services id="services" />
        <Portfolio id="portfolio" />
        <Testimonials id="testimonials" />
        <FAQs id="faqs" />
        <Contact id="contact" />
        <Footer />
        <Theme />
        {showFloatingNav && <FloatingNav />}
      </main>
    </>
  );
};

export default App;