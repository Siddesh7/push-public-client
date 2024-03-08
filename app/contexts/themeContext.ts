import {createContext, useContext} from "react";

interface Theme {
  theme: string;
  setTheme: (theme: string) => void;
}

const lightTheme: Theme = {
  theme: "garden",
  setTheme: () => {},
};

export const ThemeContext = createContext(lightTheme);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
