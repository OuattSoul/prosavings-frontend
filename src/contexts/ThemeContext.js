import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Charger le thème depuis localStorage ou utiliser 'dark' par défaut
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('prosavings-theme');
    return savedTheme || 'dark';
  });

  // Appliquer le thème au document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('prosavings-theme', theme);
    console.log('🎨 Thème appliqué:', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const setDarkTheme = () => setTheme('dark');
  const setLightTheme = () => setTheme('light');

  const value = {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setDarkTheme,
    setLightTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};