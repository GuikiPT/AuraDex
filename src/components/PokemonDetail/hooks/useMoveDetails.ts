import { useState } from 'react';
import { Move } from '@/types/pokemon';
import { pokemonApi } from '@/utils/pokemon-api';
import { UseMoveDetailsReturn } from '../types';

export const useMoveDetails = (): UseMoveDetailsReturn => {
  const [moveDetails, setMoveDetails] = useState<Record<string, Move | { loading: boolean }>>({});
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

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
    
    const moveDetail = moveDetails[moveName];
    if (moveDetail && !('loading' in moveDetail)) {
      setSelectedMove(moveDetail as Move);
      setShowMoveModal(true);
    }
  };

  return {
    moveDetails,
    selectedMove,
    showMoveModal,
    loadMoveDetails,
    batchLoadMoves,
    openMoveModal,
    setSelectedMove,
    setShowMoveModal
  };
};
