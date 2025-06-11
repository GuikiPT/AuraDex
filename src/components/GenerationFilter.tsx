'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { GENERATION_RANGES } from '@/constants/pokemon';

interface GenerationFilterProps {
  selectedGeneration: string;
  onGenerationChange: (generation: string) => void;
}

const GenerationFilter = ({ selectedGeneration, onGenerationChange }: GenerationFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedGen = GENERATION_RANGES.find(gen => 
    `${gen.start}-${gen.end}` === selectedGeneration
  );

  return (
    <div className="dropdown-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 glass rounded-xl border border-white/20 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200 min-w-[200px]"
      >
        <Sparkles className="w-4 h-4 text-blue-500" />
        <span className="flex-1 text-left">
          {selectedGen ? `${selectedGen.name}` : 'All Generations'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="dropdown-backdrop"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="dropdown-menu top-full left-0 right-0 mt-2 max-h-64 overflow-auto rounded-xl glass border border-white/20 dark:border-gray-700/50 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              <button
                onClick={() => {
                  onGenerationChange('');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  !selectedGeneration
                    ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="font-medium">All Generations</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Show all Pokémon</div>
              </button>
              
              {GENERATION_RANGES.map((gen, index) => {
                const isSelected = `${gen.start}-${gen.end}` === selectedGeneration;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      onGenerationChange(`${gen.start}-${gen.end}`);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="font-medium">{gen.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      #{gen.start}-#{gen.end}
                    </div>
                    {isSelected && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerationFilter;
