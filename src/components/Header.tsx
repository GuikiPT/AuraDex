'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import SearchBar from './SearchBar';

interface HeaderProps {
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
}

export default function Header({ onSearchChange, searchTerm }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-lg animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">AuraDex</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Pokémon Explorer
                </p>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              {onSearchChange && (
                <SearchBar
                  searchTerm={searchTerm || ''}
                  onSearchChange={onSearchChange}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-4">
              {onSearchChange && (
                <SearchBar
                  searchTerm={searchTerm || ''}
                  onSearchChange={onSearchChange}
                />
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
