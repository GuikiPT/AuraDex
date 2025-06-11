'use client';

import { Heart, Github, ExternalLink, Zap, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-20">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent dark:from-gray-950 dark:via-gray-950/95" />
      
      <div className="relative glass border-t border-white/10 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-lg animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text">AuraDex</h3>
                  <p className="text-sm text-gray-400">Pokémon Explorer</p>
                </div>
              </div>
              
              <p className="text-gray-300 dark:text-gray-400 mb-6 leading-relaxed">
                A comprehensive Pokémon database built with modern web technologies. 
                Explore, discover, and learn about your favorite Pokémon with detailed 
                stats, evolution chains, and much more.
              </p>
              
              <div className="flex items-center gap-2 text-gray-300 dark:text-gray-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>for Pokémon fans everywhere</span>
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Features
              </h4>
              <ul className="space-y-3">
                {[
                  'Pokémon Search & Filter',
                  'Detailed Stats & Info', 
                  'Evolution Charts',
                  'Type Effectiveness',
                  'Move Database',
                  'Breeding Information'
                ].map((feature, index) => (
                  <li key={index} className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors duration-200 cursor-default">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-500" />
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://pokeapi.co/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 flex items-center gap-2 transition-all duration-200"
                  >
                    PokéAPI 
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://nextjs.org/"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 flex items-center gap-2 transition-all duration-200"
                  >
                    Next.js 
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://tailwindcss.com/"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 flex items-center gap-2 transition-all duration-200"
                  >
                    Tailwind CSS 
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 flex items-center gap-2 transition-all duration-200"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-white/10 dark:border-gray-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              © 2025 AuraDex. Built for educational purposes.
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 dark:text-gray-600">Powered by</span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-300">PokéAPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
