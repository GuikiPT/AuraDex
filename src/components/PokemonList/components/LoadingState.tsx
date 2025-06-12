import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animate-reverse" style={{ animationDelay: '0.5s' }} />
    </div>
    <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg">Loading Pokémon...</p>
  </div>
);
