import React, { createContext, useState, useEffect } from 'react';
export const ThemeContext = createContext({ toggleTheme: () => {}, theme: 'light' });
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'light');
  }, []);
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};