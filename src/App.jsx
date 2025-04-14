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
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    if (window.location.hash) window.location.hash = '';
    if (onLoaded) onLoaded();
  }, [onLoaded]);

  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', `hsl(${themeState.primaryHue}, 89%, 41%)`);
    }
  }, [themeState.primaryHue]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--scrollbar-thumb-color", `hsl(${themeState.primaryHue}, 89%, 41%)`);
    root.style.setProperty("--scrollbar-track-color", 
      themeState.background === "bg-1" ? "white" : "black");
  }, [themeState.primaryHue, themeState.background]);

  const mainRef = useRef();
  const [showFloatingNav, setShowFloatingNav] = useState(true);
  const [siteYPostion, setSiteYPosition] = useState(0);

  const floatingNavToggleHandler = () => {
    const mainRect = mainRef?.current?.getBoundingClientRect();
    if (!mainRect) return;
    
    if (siteYPostion < mainRect.y - 20 || siteYPostion > mainRect.y + 20) {
      setShowFloatingNav(true);
    } else {
      setShowFloatingNav(false);
    }
    setSiteYPosition(mainRect.y);
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