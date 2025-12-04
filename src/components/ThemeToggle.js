import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Basculer vers le thème ${isDark ? 'clair' : 'sombre'}`}
      title={`Mode ${isDark ? 'clair' : 'sombre'}`}
    >
      <div className="theme-toggle-track">
        <div className={`theme-toggle-thumb ${isDark ? 'dark' : 'light'}`}>
          {isDark ? (
            <FaMoon className="theme-icon" />
          ) : (
            <FaSun className="theme-icon" />
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;