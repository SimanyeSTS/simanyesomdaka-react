const themeReducer = (state, action) => {
  if (action.type.startsWith("color-")) {
    const hues = {
      "color-1": 270,
      "color-2": 110,
      "color-3": 240,
      "color-4": 325,
      "color-5": 360,
      "color-6": 55
    };
    return { 
      ...state, 
      primary: action.type, 
      primaryHue: hues[action.type] 
    };
  }

  if (action.type === "bg-1" || action.type === "bg-2") {
    return { 
      ...state, 
      background: action.type 
    };
  }

  return state;
};

export default themeReducer;