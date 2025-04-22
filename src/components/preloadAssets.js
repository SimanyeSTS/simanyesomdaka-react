export const preloadAssets = async () => {
    const assetsToPreload = [
      require('../assets/profile.png'),
    ];
  
    const preloadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
  
    const imagePromises = assetsToPreload.map(preloadImage);
  
    const fontPromise = document.fonts.ready;
  
    await Promise.all([...imagePromises, fontPromise]);
  };
  