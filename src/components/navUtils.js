export const updateActiveLinkByScroll = (isManualScrolling, manualActiveLink) => {
    if (isManualScrolling && manualActiveLink) {
        return manualActiveLink;
    }
    
    const sections = {
        home: document.querySelector("header"),
        about: document.querySelector("#about"),
        services: document.querySelector("#services"),
        portfolio: document.querySelector("#portfolio"),
        testimonials: document.querySelector("#testimonials"),
        faqs: document.querySelector("#faqs"),
        contact: document.querySelector("#contact")
    };
    
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY + (viewportHeight * 0.3);
    
    if (window.scrollY < 100) {
        return "#";
    }
    
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
    
    sectionBoundaries.sort((a, b) => a.top - b.top);
    
    let currentSection = null;
    let isInPortfolioGroup = false;
    
    for (const section of sectionBoundaries) {
        if (scrollPosition >= section.top && scrollPosition < section.bottom) {
            currentSection = section.id;
            if (section.id === "portfolio" || section.id === "testimonials" || section.id === "faqs") {
                isInPortfolioGroup = true;
            }
            break;
        }
    }
    
    if (!currentSection) {
        let closestSection = null;
        let minDistance = Infinity;
        const isScrollingUp = window.oldScrollY > window.scrollY;
        
        for (const section of sectionBoundaries) {
            const referencePoint = isScrollingUp ? section.top : section.bottom;
            const distance = Math.abs(scrollPosition - referencePoint);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestSection = section.id;
                if (section.id === "portfolio" || section.id === "testimonials" || section.id === "faqs") {
                    isInPortfolioGroup = true;
                }
            }
        }
        
        currentSection = closestSection;
    }
    
    window.oldScrollY = window.scrollY;
    
    if (isInPortfolioGroup) {
        return "#portfolio";
    } else if (currentSection === "home") {
        return "#";
    } else if (currentSection) {
        return `#${currentSection}`;
    }
    
    return "#";
};

export const scrollToSection = (link) => {
    if (link === "#portfolio") {
        const portfolioSection = document.querySelector("#portfolio");
        if (portfolioSection) {
            window.scrollTo({
                top: portfolioSection.offsetTop,
                behavior: "smooth",
            });
        }
    }
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

if (typeof window !== 'undefined') {
    window.oldScrollY = window.scrollY;
}