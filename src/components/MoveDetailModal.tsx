'use client';

import React from 'react';
import { X, Zap, Target, Shield, Clock, Sparkles } from 'lucide-react';
import { Move } from '@/types/pokemon';
import { TYPE_COLORS, MOVE_CATEGORIES } from '@/constants/pokemon';
import { formatPokemonName } from '@/utils/pokemon-api';
import TypeIcon from './TypeIcon';

interface MoveDetailModalProps {
  move: Move | null;
  isOpen: boolean;
  onClose: () => void;
}

const MoveDetailModal = ({ move, isOpen, onClose }: MoveDetailModalProps) => {
  if (!isOpen || !move) return null;

  const categoryInfo = MOVE_CATEGORIES[move.damage_class.name] || MOVE_CATEGORIES.status;
  const englishEffect = move.effect_entries.find(entry => entry.language.name === 'en');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="glass rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 bg-white/95 dark:bg-gray-900/95">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <TypeIcon type={move.type.name} size={48} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPokemonName(move.name)}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span 
                      className="px-3 py-1 rounded-full text-xs text-white font-medium"
                      style={{ backgroundColor: TYPE_COLORS[move.type.name] || '#68D391' }}
                    >
                      {formatPokemonName(move.type.name)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span>{categoryInfo.icon}</span>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: categoryInfo.color }}
                      >
                        {categoryInfo.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Close modal"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30 text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="text-red-500" size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {move.power || '—'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Power</div>
            </div>

            <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="text-blue-500" size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {move.accuracy || '—'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy</div>
            </div>

            <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-green-500" size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {move.pp}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">PP</div>
            </div>

            <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30 text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="text-purple-500" size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                #{move.id}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Move ID</div>
            </div>
          </div>

          {/* Effect Description */}
          {englishEffect && (
            <div className="glass rounded-lg p-6 border border-white/20 dark:border-gray-700/30">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center">
                <Shield className="mr-2" size={20} />
                Effect
              </h3>
              
              {englishEffect.short_effect && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Summary</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {englishEffect.short_effect}
                  </p>
                </div>
              )}
              
              {englishEffect.effect && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Detailed Effect</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {englishEffect.effect}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Category: {categoryInfo.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Type: {formatPokemonName(move.type.name)}</span>
            </div>
            {move.power && (
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Base Power: {move.power}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveDetailModal;
