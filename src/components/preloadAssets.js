export const preloadAssets = async () => {
    const assetsToPreload = [
      require('../assets/profile.png'), // critical asset shown on loading screen
    ];
  
    const preloadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
  
    const imagePromises = assetsToPreload.map(preloadImage);
  
    // Wait for fonts to be ready (Montserrat, etc.)
    const fontPromise = document.fonts.ready;
  
    await Promise.all([...imagePromises, fontPromise]);
  };
  