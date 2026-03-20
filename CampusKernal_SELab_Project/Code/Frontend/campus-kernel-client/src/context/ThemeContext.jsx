import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [zoomLevel, setZoomLevel] = useState(() => {
    const savedZoom = localStorage.getItem('zoomLevel');
    return savedZoom ? parseFloat(savedZoom) : 1;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${Math.round(16 * zoomLevel)}px`;
    localStorage.setItem('zoomLevel', zoomLevel.toString());
  }, [zoomLevel]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const increaseTextSize = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  const decreaseTextSize = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.8));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, zoomLevel, increaseTextSize, decreaseTextSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
