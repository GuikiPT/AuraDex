import React, { useState, useEffect } from 'react';
import { Gamepad2, Filter, Zap, Shield, Baby, Star } from 'lucide-react';
import { Pokemon, Move } from '@/types/pokemon';
import { pokemonApi, formatPokemonName } from '@/utils/pokemon-api';
import { VERSION_GROUPS, MOVE_CATEGORIES, TYPE_COLORS } from '@/constants/pokemon';

interface MovesTabProps {
  pokemon: Pokemon;
}

export const MovesTab: React.FC<MovesTabProps> = ({ pokemon }) => {
  const [selectedVersionGroup, setSelectedVersionGroup] = useState<string>('');
  const [moveDetails, setMoveDetails] = useState<Record<string, Move | { loading: boolean }>>({});

  // Get all available version groups for this Pokemon and sort them by order
  const availableVersionGroups = [
    ...new Set(
      pokemon.moves.flatMap(move => 
        move.version_group_details.map(detail => detail.version_group.name)
      )
    )
  ].sort((a, b) => {
    const orderA = VERSION_GROUPS[a]?.order || 999;
    const orderB = VERSION_GROUPS[b]?.order || 999;
    return orderA - orderB;
  });

  // Set default version group if not selected (use the latest available game)
  const currentVersionGroup = selectedVersionGroup || availableVersionGroups[availableVersionGroups.length - 1] || '';

  // Filter moves by version group
  const getMovesForVersionGroup = (learnMethod: string) => {
    return pokemon.moves
      .filter(move => move.version_group_details.some(detail => 
        detail.move_learn_method.name === learnMethod &&
        detail.version_group.name === currentVersionGroup
      ))
      .map(move => {
        const versionDetail = move.version_group_details.find(detail => 
          detail.move_learn_method.name === learnMethod &&
          detail.version_group.name === currentVersionGroup
        );
        return {
          ...move,
          level: versionDetail?.level_learned_at || 0,
          versionDetail
        };
      })
      .sort((a, b) => {
        if (learnMethod === 'level-up') {
          return a.level - b.level;
        }
        return a.move.name.localeCompare(b.move.name);
      });
  };

  const levelUpMoves = getMovesForVersionGroup('level-up');
  const tmMoves = getMovesForVersionGroup('machine');
  const eggMoves = getMovesForVersionGroup('egg');
  const tutorMoves = getMovesForVersionGroup('tutor');

  // Function to load move details with individual loading states
  const loadMoveDetails = async (moveName: string) => {
    if (moveDetails[moveName]) return;
    
    // Create a loading placeholder to prevent duplicate requests
    setMoveDetails(prev => ({ 
      ...prev, 
      [moveName]: { 
        loading: true 
      } as Move | { loading: boolean }
    }));
    
    try {
      const moveData = await pokemonApi.getMove(moveName);
      setMoveDetails(prev => ({ ...prev, [moveName]: moveData }));
    } catch (error: unknown) {
      console.error(`Failed to load move details for ${moveName}:`, error);
      // Remove the loading placeholder on error
      setMoveDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[moveName];
        return newDetails;
      });
    }
  };

  // Batch load multiple moves at once for better performance
  const batchLoadMoves = async (moveNames: string[]) => {
    const movesToLoad = moveNames.filter(name => !moveDetails[name]);
    if (movesToLoad.length === 0) return;

    // Set loading states for all moves
    setMoveDetails(prev => {
      const newDetails = { ...prev };
      movesToLoad.forEach(name => {
        newDetails[name] = { loading: true } as Move | { loading: boolean };
      });
      return newDetails;
    });

    // Load moves in parallel with limited concurrency
    const loadMove = async (moveName: string) => {
      try {
        const moveData = await pokemonApi.getMove(moveName);
        setMoveDetails(prev => ({ ...prev, [moveName]: moveData }));
      } catch (error: unknown) {
        console.error(`Failed to batch load move ${moveName}:`, error);
        setMoveDetails(prev => {
          const newDetails = { ...prev };
          delete newDetails[moveName];
          return newDetails;
        });
      }
    };

    // Load moves in batches of 5 to avoid overwhelming the API
    for (let i = 0; i < movesToLoad.length; i += 5) {
      const batch = movesToLoad.slice(i, i + 5);
      await Promise.allSettled(batch.map(loadMove));
      
      // Small delay between batches to be respectful to the API
      if (i + 5 < movesToLoad.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  };

  // Function to open move details modal
  const openMoveModal = async (moveName: string) => {
    // If we don't have the move details yet, load them
    if (!moveDetails[moveName] || 'loading' in moveDetails[moveName]) {
      await loadMoveDetails(moveName);
    }
    
    // For now, just console.log the move details
    const moveDetail = moveDetails[moveName];
    if (moveDetail && !('loading' in moveDetail)) {
      console.log('Move details:', moveDetail);
      // TODO: Implement modal functionality
    }
  };

  // Preload move details for visible moves using batch loading
  const preloadMoveDetails = async (moves: Array<{ move: { name: string; url: string }; level: number }>) => {
    const visibleMoves = moves.slice(0, 15); // Load first 15 moves
    const moveNames = visibleMoves.map(move => move.move.name);
    await batchLoadMoves(moveNames);
  };

  const MoveRow = ({ move, showLevel = false }: { 
    move: { 
      move: { name: string; url: string }; 
      level: number; 
      versionDetail?: {
        level_learned_at: number;
        move_learn_method: { name: string; url: string };
        version_group: { name: string; url: string };
      }
    }; 
    showLevel?: boolean 
  }) => {
    const moveDetail = moveDetails[move.move.name];
    const isLoading = moveDetail && 'loading' in moveDetail;
    const actualMoveDetail = !isLoading ? moveDetail as Move : null;
    const moveCategory = actualMoveDetail?.damage_class.name || 'status';
    const categoryInfo = MOVE_CATEGORIES[moveCategory] || MOVE_CATEGORIES.status;

    // Auto-load move details when component mounts
    useEffect(() => {
      if (!moveDetail && move.move.name) {
        loadMoveDetails(move.move.name);
      }
    }, [move.move.name, moveDetail]);

    return (
      <tr 
        className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
        onClick={() => openMoveModal(move.move.name)}
        title="Click to view detailed move information"
      >
        {showLevel && (
          <td className="py-3 px-2 text-gray-900 dark:text-gray-100 font-medium">
            {move.level || '—'}
          </td>
        )}
        <td className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-100">
          {formatPokemonName(move.move.name)}
        </td>
        <td className="py-3 px-2">
          {actualMoveDetail ? (
            <span 
              className="px-3 py-1 rounded-full text-xs text-white font-medium"
              style={{ backgroundColor: TYPE_COLORS[actualMoveDetail.type.name] || '#68D391' }}
            >
              {formatPokemonName(actualMoveDetail.type.name)}
            </span>
          ) : (
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 animate-pulse">
              Loading...
            </div>
          )}
        </td>
        <td className="py-3 px-2">
          <div className="flex items-center space-x-1">
            <span>{categoryInfo.icon}</span>
            <span className="text-xs" style={{ color: categoryInfo.color }}>
              {actualMoveDetail ? categoryInfo.name : 'Loading...'}
            </span>
          </div>
        </td>
        <td className="py-3 px-2 text-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {actualMoveDetail?.power || '—'}
          </span>
        </td>
        <td className="py-3 px-2 text-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {actualMoveDetail?.accuracy || '—'}
          </span>
        </td>
        <td className="py-3 px-2 text-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {actualMoveDetail?.pp || '—'}
          </span>
        </td>
      </tr>
    );
  };

  const MoveTable = ({ moves, title, icon, showLevel = false }: { 
    moves: Array<{ 
      move: { name: string; url: string }; 
      level: number; 
      versionDetail?: {
        level_learned_at: number;
        move_learn_method: { name: string; url: string };
        version_group: { name: string; url: string };
      }
    }>; 
    title: string; 
    icon: React.ReactNode; 
    showLevel?: boolean;
  }) => {
    // Preload move details when component mounts - must be before any conditional returns
    useEffect(() => {
      if (moves.length > 0) {
        preloadMoveDetails(moves);
      }
    }, [moves]);

    if (moves.length === 0) return null;

    return (
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
          {icon}
          {title}
          <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
            {moves.length}
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {showLevel && (
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Level</th>
                )}
                <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Move</th>
                <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Type</th>
                <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Category</th>
                <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Power</th>
                <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Accuracy</th>
                <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">PP</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((move, index) => (
                <MoveRow key={index} move={move} showLevel={showLevel} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Version Group Selector */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Gamepad2 className="mr-2" size={20} />
            Game Version
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Filter size={16} />
            <span>Filter moves by game</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {availableVersionGroups.map((versionGroup) => {
            const versionInfo = VERSION_GROUPS[versionGroup];
            const isSelected = currentVersionGroup === versionGroup;
            
            return (
              <button
                key={versionGroup}
                onClick={() => setSelectedVersionGroup(versionGroup)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-105'
                    : 'bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="font-medium text-sm">
                  {versionInfo?.name || formatPokemonName(versionGroup)}
                </div>
                {versionInfo && (
                  <div className={`text-xs mt-1 flex items-center justify-between ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span>Gen {versionInfo.generation}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${isSelected ? 'bg-blue-400/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      #{versionInfo.order}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Game Info & Load All Button */}
      {currentVersionGroup && VERSION_GROUPS[currentVersionGroup] && (
        <div className="glass rounded-xl p-4 border border-white/20 dark:border-gray-700/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Viewing moves for: {VERSION_GROUPS[currentVersionGroup].name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generation {VERSION_GROUPS[currentVersionGroup].generation} • 
                {VERSION_GROUPS[currentVersionGroup].games.join(', ')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  const allMoves = [...levelUpMoves, ...tmMoves, ...eggMoves, ...tutorMoves];
                  const moveNames = allMoves.map(move => move.move.name);
                  batchLoadMoves(moveNames);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium text-sm hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                title="Load all move details for better browsing"
              >
                <Zap size={16} />
                <span>Load All Moves</span>
              </button>
              <div className="text-2xl">🎮</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Load Hint */}
      <div className="glass rounded-xl p-3 border border-white/20 dark:border-gray-700/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>💡</span>
          <span>Tip: Click on any move row to view detailed information in a popup, or use &ldquo;Load All Moves&rdquo; for faster browsing</span>
        </div>
      </div>

      {/* Move Tables */}
      <MoveTable 
        moves={levelUpMoves} 
        title="Level Up Moves" 
        icon={<Zap className="mr-2" size={20} />}
        showLevel={true}
      />
      
      <MoveTable 
        moves={tmMoves} 
        title="TM/TR Moves" 
        icon={<Shield className="mr-2" size={20} />}
      />

      <MoveTable 
        moves={eggMoves} 
        title="Egg Moves" 
        icon={<Baby className="mr-2" size={20} />}
      />

      {tutorMoves.length > 0 && (
        <MoveTable 
          moves={tutorMoves} 
          title="Move Tutor" 
          icon={<Star className="mr-2" size={20} />}
        />
      )}

      {/* Summary */}
      <div className="glass rounded-xl p-4 border border-white/20 dark:border-gray-700/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-500">{levelUpMoves.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Level Up</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-500">{tmMoves.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">TM/TR</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-500">{eggMoves.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Egg Moves</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">
              {levelUpMoves.length + tmMoves.length + eggMoves.length + tutorMoves.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};
