'use client';

import React, { useState, useEffect } from 'react';
import { Star, Zap, Shield, Heart, Users, Gamepad2, MapPin } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { usePokemonDetail, useMoveDetails, useEncounters } from './hooks';
import { PokemonDetailProps, TabId, Tab, ModalState, UIState } from './types';
import {
  PokemonHeader,
  TabNavigation,
  OverviewTab,
  StatsTab,
  TypeDefensesTab,
  BreedingTab,
  EvolutionTab,
  MovesTab,
  LocationsTab
} from './components';
import LoadingSpinner from '../LoadingSpinner';
import SpritesModal from '../SpritesModal';
import MoveDetailModal from '../MoveDetailModal';
import MegaEvolutionModal from '../MegaEvolutionModal';
import HeroBackground from '../layout/HeroBackground';

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemonId }) => {
  // Main Pokemon data
  const {
    pokemon,
    species,
    evolutionChain,
    megaEvolutions,
    megaEvolutionsLoading,
    typeEffectiveness,
    loading,
    fetchPokemonData
  } = usePokemonDetail(pokemonId);

  // Move details management
  const {
    selectedMove,
    showMoveModal,
    setSelectedMove,
    setShowMoveModal
  } = useMoveDetails();

  // Encounters management
  const {
    encounters,
    encountersLoading,
    locationDetails,
    fetchEncounterData
  } = useEncounters(pokemonId);

  // UI state
  const [uiState, setUIState] = useState<UIState>({
    activeTab: 'overview',
    currentDescriptionIndex: 0,
    statChartVariant: 'horizontal'
  });

  // Modal state
  const [modalState, setModalState] = useState<ModalState>({
    showSpritesModal: false,
    showMoveModal: false,
    showMegaModal: false,
    selectedMegaEvolution: null
  });

  // Tab definitions
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'stats', label: 'Base Stats', icon: Zap },
    { id: 'type-defenses', label: 'Type Defenses', icon: Shield },
    { id: 'breeding', label: 'Breeding', icon: Heart },
    { id: 'evolution', label: 'Evolution', icon: Users },
    { id: 'moves', label: 'Moves Learned', icon: Gamepad2 },
    { id: 'locations', label: 'Locations', icon: MapPin },
  ];

  // Load Pokemon data on mount
  useEffect(() => {
    fetchPokemonData();
  }, [pokemonId, fetchPokemonData]);

  // Load encounters when locations tab is accessed
  useEffect(() => {
    if (uiState.activeTab === 'locations' && pokemon && encounters.length === 0 && !encountersLoading) {
      fetchEncounterData();
    }
  }, [uiState.activeTab, pokemon, encounters.length, encountersLoading, fetchEncounterData]);

  // Loading state
  if (loading || !pokemon || !species) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <HeroBackground />
        <div className="relative z-10">
          <LoadingSpinner size="lg" text={`Loading ${pokemonId ? `Pokémon #${pokemonId}` : 'Pokémon'}...`} />
        </div>
      </div>
    );
  }

  // Helper functions for description navigation
  const englishDescriptions = species.flavor_text_entries
    ?.filter(entry => entry.language.name === 'en') || [];
  
  const englishGenus = species.genera
    ?.find(genus => genus.language.name === 'en')?.genus || 'Pokémon';

  const handlePrevDescription = () => {
    setUIState(prev => ({
      ...prev,
      currentDescriptionIndex: prev.currentDescriptionIndex > 0 
        ? prev.currentDescriptionIndex - 1 
        : englishDescriptions.length - 1
    }));
  };

  const handleNextDescription = () => {
    setUIState(prev => ({
      ...prev,
      currentDescriptionIndex: prev.currentDescriptionIndex < englishDescriptions.length - 1 
        ? prev.currentDescriptionIndex + 1 
        : 0
    }));
  };

  const handleSetDescriptionIndex = (index: number) => {
    setUIState(prev => ({ ...prev, currentDescriptionIndex: index }));
  };

  const handleStatChartVariantChange = (variant: 'horizontal' | 'radial') => {
    setUIState(prev => ({ ...prev, statChartVariant: variant }));
  };

  const handleTabChange = (tabId: TabId) => {
    setUIState(prev => ({ ...prev, activeTab: tabId }));
  };

  const handleShowSpritesModal = () => {
    setModalState(prev => ({ ...prev, showSpritesModal: true }));
  };

  const handleCloseSpritesModal = () => {
    setModalState(prev => ({ ...prev, showSpritesModal: false }));
  };

  const handleMegaEvolutionClick = (megaPokemon: Pokemon) => {
    setModalState(prev => ({
      ...prev,
      selectedMegaEvolution: megaPokemon,
      showMegaModal: true
    }));
  };

  const handleCloseMegaModal = () => {
    setModalState(prev => ({
      ...prev,
      showMegaModal: false,
      selectedMegaEvolution: null
    }));
  };

  const handleCloseMoveModal = () => {
    setShowMoveModal(false);
    setSelectedMove(null);
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (uiState.activeTab) {
      case 'overview':
        return (
          <OverviewTab
            pokemon={pokemon}
            species={species}
            englishDescriptions={englishDescriptions}
            englishGenus={englishGenus}
            currentDescriptionIndex={uiState.currentDescriptionIndex}
            onPrevDescription={handlePrevDescription}
            onNextDescription={handleNextDescription}
            onSetDescriptionIndex={handleSetDescriptionIndex}
          />
        );
      case 'stats':
        return (
          <StatsTab
            pokemon={pokemon}
            statChartVariant={uiState.statChartVariant}
            onStatChartVariantChange={handleStatChartVariantChange}
          />
        );
      case 'type-defenses':
        return <TypeDefensesTab typeEffectiveness={typeEffectiveness} />;
      case 'breeding':
        return <BreedingTab species={species} />;
      case 'evolution':
        return (
          <EvolutionTab
            evolutionChain={evolutionChain}
            megaEvolutions={megaEvolutions}
            megaEvolutionsLoading={megaEvolutionsLoading}
            onMegaEvolutionClick={handleMegaEvolutionClick}
          />
        );
      case 'moves':
        return <MovesTab pokemon={pokemon} />;
      case 'locations':
        return (
          <LocationsTab
            encounters={encounters}
            encountersLoading={encountersLoading}
            pokemonId={pokemon?.id}
            locationDetails={locationDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <HeroBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <PokemonHeader
          pokemon={pokemon}
          onShowSpritesModal={handleShowSpritesModal}
        />

        {/* Navigation Tabs */}
        <TabNavigation
          tabs={tabs}
          activeTab={uiState.activeTab}
          onTabChange={handleTabChange}
          encountersLoading={encountersLoading}
        />

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {renderTabContent()}
        </div>
      </div>
      
      {/* Sprites Modal */}
      <SpritesModal
        pokemon={pokemon}
        isOpen={modalState.showSpritesModal}
        onClose={handleCloseSpritesModal}
      />
      
      {/* Move Detail Modal */}
      <MoveDetailModal
        move={selectedMove}
        isOpen={showMoveModal}
        onClose={handleCloseMoveModal}
      />
      
      {/* Mega Evolution Modal */}
      <MegaEvolutionModal
        pokemon={modalState.selectedMegaEvolution}
        isOpen={modalState.showMegaModal}
        onClose={handleCloseMegaModal}
      />
    </div>
  );
};

export default PokemonDetail;
