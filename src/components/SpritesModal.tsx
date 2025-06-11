'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Download, Sparkles } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { formatPokemonName } from '@/utils/pokemon-api';

interface SpritesModalProps {
  pokemon: Pokemon;
  isOpen: boolean;
  onClose: () => void;
}

interface SpriteItem {
  url: string;
  label: string;
  category: string;
  isShiny?: boolean;
}

const SpritesModal = ({ pokemon, isOpen, onClose }: SpritesModalProps) => {
  const [activeCategory, setActiveCategory] = useState('main');

  if (!isOpen) return null;

  // Collect all available sprites
  const sprites: SpriteItem[] = [];

  // Main sprites
  if (pokemon.sprites.front_default) {
    sprites.push({
      url: pokemon.sprites.front_default,
      label: 'Front Default',
      category: 'main'
    });
  }
  if (pokemon.sprites.front_shiny) {
    sprites.push({
      url: pokemon.sprites.front_shiny,
      label: 'Front Shiny',
      category: 'main',
      isShiny: true
    });
  }
  if (pokemon.sprites.back_default) {
    sprites.push({
      url: pokemon.sprites.back_default,
      label: 'Back Default',
      category: 'main'
    });
  }
  if (pokemon.sprites.back_shiny) {
    sprites.push({
      url: pokemon.sprites.back_shiny,
      label: 'Back Shiny',
      category: 'main',
      isShiny: true
    });
  }

  // Official artwork
  if (pokemon.sprites.other['official-artwork']?.front_default) {
    sprites.push({
      url: pokemon.sprites.other['official-artwork'].front_default,
      label: 'Official Artwork',
      category: 'artwork'
    });
  }
  if (pokemon.sprites.other['official-artwork']?.front_shiny) {
    sprites.push({
      url: pokemon.sprites.other['official-artwork'].front_shiny,
      label: 'Official Artwork (Shiny)',
      category: 'artwork',
      isShiny: true
    });
  }

  // Dream World
  if (pokemon.sprites.other.dream_world?.front_default) {
    sprites.push({
      url: pokemon.sprites.other.dream_world.front_default,
      label: 'Dream World',
      category: 'special'
    });
  }

  // Home
  if (pokemon.sprites.other.home?.front_default) {
    sprites.push({
      url: pokemon.sprites.other.home.front_default,
      label: 'Pokémon Home',
      category: 'special'
    });
  }
  if (pokemon.sprites.other.home?.front_shiny) {
    sprites.push({
      url: pokemon.sprites.other.home.front_shiny,
      label: 'Pokémon Home (Shiny)',
      category: 'special',
      isShiny: true
    });
  }

  // Showdown
  if (pokemon.sprites.other.showdown?.front_default) {
    sprites.push({
      url: pokemon.sprites.other.showdown.front_default,
      label: 'Showdown Front',
      category: 'animated'
    });
  }
  if (pokemon.sprites.other.showdown?.front_shiny) {
    sprites.push({
      url: pokemon.sprites.other.showdown.front_shiny,
      label: 'Showdown Front (Shiny)',
      category: 'animated',
      isShiny: true
    });
  }
  if (pokemon.sprites.other.showdown?.back_default) {
    sprites.push({
      url: pokemon.sprites.other.showdown.back_default,
      label: 'Showdown Back',
      category: 'animated'
    });
  }
  if (pokemon.sprites.other.showdown?.back_shiny) {
    sprites.push({
      url: pokemon.sprites.other.showdown.back_shiny,
      label: 'Showdown Back (Shiny)',
      category: 'animated',
      isShiny: true
    });
  }

  const categories = [
    { id: 'main', label: 'Main Sprites', icon: '🎮' },
    { id: 'artwork', label: 'Official Artwork', icon: '🎨' },
    { id: 'special', label: 'Special', icon: '✨' },
    { id: 'animated', label: 'Animated', icon: '🎬' },
  ];

  const filteredSprites = sprites.filter(sprite => sprite.category === activeCategory);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] mx-4 glass rounded-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-gray-700/30">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatPokemonName(pokemon.name)} Sprites
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              #{pokemon.id.toString().padStart(3, '0')} • {sprites.length} sprites available
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 p-4 bg-white/5 dark:bg-gray-800/20 overflow-x-auto">
          {categories.map((category) => {
            const hasSprites = sprites.some(sprite => sprite.category === category.id);
            if (!hasSprites) return null;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/20 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/50'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sprites Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredSprites.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSprites.map((sprite, index) => (
                <div
                  key={index}
                  className="group relative bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-white/30 dark:border-gray-700/30 hover:scale-105 transition-all duration-200"
                >
                  {/* Shiny indicator */}
                  {sprite.isShiny && (
                    <div className="absolute top-2 right-2 z-10">
                      <Sparkles className="w-5 h-5 text-yellow-500 drop-shadow-lg" />
                    </div>
                  )}
                  
                  {/* Image container */}
                  <div className="relative w-full aspect-square mb-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={sprite.url}
                      alt={sprite.label}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized={sprite.url.endsWith('.gif') || sprite.url.endsWith('.svg')}
                    />
                  </div>
                  
                  {/* Label */}
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center mb-2">
                    {sprite.label}
                  </p>
                  
                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(
                      sprite.url,
                      `${pokemon.name}-${sprite.label.toLowerCase().replace(/\s+/g, '-')}.${sprite.url.split('.').pop()}`
                    )}
                    className="w-full flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No sprites available in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpritesModal;
