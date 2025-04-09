// navUtils.js
export const updateActiveLinkByScroll = () => {
    // Get all section elements
    const sections = {
        home: document.querySelector("header"),
        about: document.querySelector("#about"),
        services: document.querySelector("#services"),
        portfolio: document.querySelector("#portfolio"),
        testimonials: document.querySelector("#testimonials"),
        faqs: document.querySelector("#faqs"),
        contact: document.querySelector("#contact")
    };
    
    // Get current scroll position with viewport height adjustment
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY + (viewportHeight * 0.3);
    
    // Default to home/top for very top of page
    if (window.scrollY < 100) {
        return "#";
    }
    
    // Get section boundaries for all sections
    const sectionBoundaries = [];
    for (const [id, section] of Object.entries(sections)) {
        if (!section) continue;
        
        sectionBoundaries.push({
            id,
            top: section.offsetTop,
            bottom: section.offsetTop + section.offsetHeight,
            height: section.offsetHeight
        });
    }
    
    // Sort sections by position (top to bottom)
    sectionBoundaries.sort((a, b) => a.top - b.top);
    
    // Find the section we're currently in or closest to
    let currentSection = null;
    let isInPortfolioGroup = false;
    
    // First check if we're directly inside a section
    for (const section of sectionBoundaries) {
        if (scrollPosition >= section.top && scrollPosition < section.bottom) {
            currentSection = section.id;
            // Check if we're in the portfolio group
            if (section.id === "portfolio" || section.id === "testimonials" || section.id === "faqs") {
                isInPortfolioGroup = true;
            }
            break;
        }
    }
    
    // If we're not clearly in a section, find the closest one
    if (!currentSection) {
        let closestSection = null;
        let minDistance = Infinity;
        const isScrollingUp = window.oldScrollY > window.scrollY;
        
        for (const section of sectionBoundaries) {
            // Calculate distance based on scroll direction
            const referencePoint = isScrollingUp ? section.top : section.bottom;
            const distance = Math.abs(scrollPosition - referencePoint);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestSection = section.id;
                // Check if we're close to the portfolio group
                if (section.id === "portfolio" || section.id === "testimonials" || section.id === "faqs") {
                    isInPortfolioGroup = true;
                }
            }
        }
        
        currentSection = closestSection;
    }
    
    // Store current scroll position for next comparison
    window.oldScrollY = window.scrollY;
    
    // Apply special case for portfolio group
    if (isInPortfolioGroup) {
        return "#portfolio";
    } else if (currentSection === "home") {
        return "#";
    } else if (currentSection) {
        return `#${currentSection}`;
    }
    
    return "#"; // Default to home if nothing is found
};

export const scrollToSection = (link) => {
    // Special handling for Portfolio link
    if (link === "#portfolio") {
        const portfolioSection = document.querySelector("#portfolio");
        if (portfolioSection) {
            window.scrollTo({
                top: portfolioSection.offsetTop,
                behavior: "smooth",
            });
        }
    }
    // Handle scrolling to other sections
    else if (link === "#") {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    } else {
        const targetElement = document.querySelector(link);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: "smooth",
            });
        }
    }
};

// Initialize scroll direction tracking
if (typeof window !== 'undefined') {
    window.oldScrollY = window.scrollY;
}