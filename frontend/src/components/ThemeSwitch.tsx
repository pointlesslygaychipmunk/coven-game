// components/ThemeSwitch.tsx
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitch() {
  const [dark, setDark] = useState(() => localStorage.theme === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.theme = dark ? 'dark' : 'light';
  }, [dark]);
  return (
    <button onClick={() => setDark(!dark)} className="p-2">
      {dark ? <Sun size={18}/> : <Moon size={18}/>}
    </button>
  );
}