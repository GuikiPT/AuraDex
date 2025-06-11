'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { name: 'Light', value: 'light' as const, icon: Sun },
    { name: 'Dark', value: 'dark' as const, icon: Moon },
    { name: 'System', value: 'system' as const, icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[1]; // Default to dark theme

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative p-3 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Toggle theme"
      >
        <currentTheme.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 z-[70] min-w-[160px] p-2 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    theme === themeOption.value
                      ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{themeOption.name}</span>
                  {theme === themeOption.value && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
