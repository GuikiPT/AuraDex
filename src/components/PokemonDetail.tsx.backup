'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Heart, Star, Zap, Shield, Users, Baby, ArrowRight, ChevronRight, Ruler, Book, BarChart, Activity, Gamepad2, Filter, MapPin } from 'lucide-react';
import { Pokemon, PokemonSpecies, EvolutionChain, TypeEffectiveness, EvolutionChainLink, EvolutionDetail, Move, PokemonEncounter, LocationArea } from '@/types/pokemon';
import { pokemonApi, calculateTypeEffectiveness, formatPokemonName, getPokemonId, getPokemonNameFromUrl, formatLocationName, formatEncounterRate } from '@/utils/pokemon-api';
import { TYPE_COLORS, EGG_GROUP_NAMES, GROWTH_RATES, VERSION_GROUPS, MOVE_CATEGORIES, ENCOUNTER_METHODS, ENCOUNTER_CONDITIONS } from '@/constants/pokemon';
import { getSupplementalEncounters, convertSupplementalToEncounterFormat, hasSupplementalDataForGame } from '@/data/supplemental-encounters';
import { getSvEncounters, convertSvToEncounterFormat } from '@/data/sv-encounters';
import TypeIcon from './TypeIcon';
import StatChart from './StatChart';
import LoadingSpinner from './LoadingSpinner';
import SpritesModal from './SpritesModal';
import MoveDetailModal from './MoveDetailModal';
import MegaEvolutionModal from './MegaEvolutionModal';
import HeroBackground from './layout/HeroBackground';

interface PokemonDetailProps {
  pokemonId: string;
}

const PokemonDetail = ({ pokemonId }: PokemonDetailProps) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [megaEvolutions, setMegaEvolutions] = useState<Pokemon[]>([]);
  const [megaEvolutionsLoading, setMegaEvolutionsLoading] = useState(false);
  const [typeEffectiveness, setTypeEffectiveness] = useState<Record<string, number>>({});
  const [encounters, setEncounters] = useState<PokemonEncounter[]>([]);
  const [encountersLoading, setEncountersLoading] = useState(false);
  const [locationDetails, setLocationDetails] = useState<Record<string, LocationArea>>({});
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSpritesModal, setShowSpritesModal] = useState(false);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);
  const [statChartVariant, setStatChartVariant] = useState<'horizontal' | 'radial'>('horizontal');
  const [selectedVersionGroup, setSelectedVersionGroup] = useState<string>('');
  const [moveDetails, setMoveDetails] = useState<Record<string, Move | { loading: boolean }>>({});
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedMegaEvolution, setSelectedMegaEvolution] = useState<Pokemon | null>(null);
  const [showMegaModal, setShowMegaModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        
        // Fetch Pokemon data
        const pokemonData = await pokemonApi.getPokemon(pokemonId);
        setPokemon(pokemonData);
        
        // Fetch species data
        const speciesData = await pokemonApi.getPokemonSpecies(pokemonId);
        setSpecies(speciesData);
        
        // Reset description index when switching Pokemon
        setCurrentDescriptionIndex(0);
        
        // Fetch evolution chain
        const evolutionId = getPokemonId(speciesData.evolution_chain.url);
        const evolutionData = await pokemonApi.getEvolutionChain(evolutionId);
        setEvolutionChain(evolutionData);
        
        // Fetch mega evolutions and other varieties from the entire evolution line
        setMegaEvolutionsLoading(true);
        const megaEvolutionData: Pokemon[] = [];
        console.log('Fetching mega evolutions for evolution line...');
        
        // Helper function to get all Pokemon in evolution chain
        const getAllPokemonInChain = (chain: EvolutionChainLink): string[] => {
          const pokemon: string[] = [chain.species.name];
          for (const evolution of chain.evolves_to) {
            pokemon.push(...getAllPokemonInChain(evolution));
          }
          return pokemon;
        };
        
        // Get all Pokemon names in the evolution chain
        const evolutionChainPokemon = getAllPokemonInChain(evolutionData.chain);
        console.log('Pokemon in evolution chain:', evolutionChainPokemon);
        
        // Check for mega evolutions in each Pokemon's species data
        for (const pokemonName of evolutionChainPokemon) {
          try {
            const chainSpeciesData = await pokemonApi.getPokemonSpecies(pokemonName);
            console.log(`Checking varieties for ${pokemonName}:`, chainSpeciesData.varieties);
            
            for (const variety of chainSpeciesData.varieties) {
              if (!variety.is_default) {
                const name = variety.pokemon.name;
                console.log(`Checking variety: ${name}`);
                // Include mega evolutions, gigantamax forms, and other special forms
                if (name.includes('mega') || name.includes('gmax') || name.includes('primal') || 
                    name.includes('ultra') || name.includes('shadow') || name.includes('purified')) {
                  try {
                    console.log(`Fetching variety: ${name}`);
                    const varietyName = getPokemonNameFromUrl(variety.pokemon.url);
                    const varietyPokemon = await pokemonApi.getPokemon(varietyName);
                    megaEvolutionData.push(varietyPokemon);
                    console.log(`Successfully fetched: ${varietyPokemon.name}`);
                  } catch (error) {
                    console.error(`Failed to fetch variety ${variety.pokemon.name}:`, error);
                  }
                } else {
                  console.log(`Skipping variety (no match): ${name}`);
                }
              }
            }
          } catch (error) {
            console.error(`Failed to fetch species data for ${pokemonName}:`, error);
          }
        }
        
        console.log('Final mega evolutions found:', megaEvolutionData);
        setMegaEvolutions(megaEvolutionData);
        setMegaEvolutionsLoading(false);
        
        // Fetch type effectiveness data
        const typeData: Record<string, TypeEffectiveness> = {};
        for (const type of pokemonData.types) {
          typeData[type.type.name] = await pokemonApi.getTypeEffectiveness(type.type.name);
        }
        
        const effectiveness = calculateTypeEffectiveness(
          pokemonData.types.map(t => t.type.name),
          typeData
        );
        setTypeEffectiveness(effectiveness);
        
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [pokemonId]);

  // Load move details for the first few moves when moves tab is active
  useEffect(() => {
    if (activeTab === 'moves' && pokemon && Object.keys(moveDetails).length === 0) {
      const loadInitialMoveDetails = async () => {
        const movesToLoad = pokemon.moves.slice(0, 5); // Load first 5 moves
        for (const moveData of movesToLoad) {
          try {
            const moveDetail = await pokemonApi.getMove(moveData.move.name);
            setMoveDetails(prev => ({ ...prev, [moveData.move.name]: moveDetail }));
          } catch (error) {
            console.error(`Failed to load move ${moveData.move.name}:`, error);
          }
        }
      };
      loadInitialMoveDetails();
    }
  }, [activeTab, pokemon, moveDetails]);

  // Load encounter data when locations tab is accessed
  useEffect(() => {
    if (activeTab === 'locations' && pokemon && encounters.length === 0 && !encountersLoading) {
      const fetchEncounterData = async () => {
        try {
          setEncountersLoading(true);
          
          // Fetch PokéAPI encounter data
          const encounterData = await pokemonApi.getPokemonEncounters(pokemon.id.toString());
          
          // Get supplemental encounter data for modern games
          const supplementalData = getSupplementalEncounters(pokemon.id);
          const combinedEncounters = [...encounterData];
          
          if (supplementalData) {
            // Add supplemental encounters for modern games
            const modernGames = ['sword', 'shield', 'brilliant-diamond', 'shining-pearl', 'legends-arceus', 'scarlet', 'violet'];
            
            for (const game of modernGames) {
              if (supplementalData.games[game]) {
                const supplementalEncounters = convertSupplementalToEncounterFormat(supplementalData, game);
                combinedEncounters.push(...supplementalEncounters);
              }
            }
          }

          const svData = getSvEncounters(pokemon.name);
          if (svData) {
            const svEncounters = convertSvToEncounterFormat(svData);
            combinedEncounters.push(...svEncounters);
          }
          
          setEncounters(combinedEncounters);

          // Fetch location area details for PokéAPI encounters only
          const pokeApiEncounters = encounterData.filter(encounter => 
            !encounter.location_area.url.includes('#supplemental')
          );
          
          const locationDetailPromises = pokeApiEncounters.map(async (encounter) => {
            try {
              const locationArea = await pokemonApi.getLocationArea(encounter.location_area.name);
              return { [encounter.location_area.name]: locationArea };
            } catch (error) {
              console.error(`Failed to fetch location area ${encounter.location_area.name}:`, error);
              return {};
            }
          });

          const locationDetailResults = await Promise.all(locationDetailPromises);
          const combinedLocationDetails = locationDetailResults.reduce(
            (acc, detail) => ({ ...acc, ...detail }),
            {}
          );
          setLocationDetails(combinedLocationDetails);
          
        } catch (error) {
          console.error('Error fetching encounter data:', error);
        } finally {
          setEncountersLoading(false);
        }
      };

      fetchEncounterData();
    }
  }, [activeTab, pokemon, encounters.length, encountersLoading]);

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Background */}
        <HeroBackground />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="glass rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
            <LoadingSpinner size="lg" text="Loading Pokémon data..." />
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon || !species) {
    return (
      <div className="min-h-screen">
        {/* Hero Background */}
        <HeroBackground />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="glass rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Pokémon not found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The Pokémon you&rsquo;re looking for doesn&rsquo;t exist or couldn&rsquo;t be loaded.</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              Go back to Pokédex
            </button>
          </div>
        </div>
      </div>
    );
  }

  const englishDescriptions = species?.flavor_text_entries.filter(
    entry => entry.language.name === 'en'
  ) || [];

  const englishGenus = species?.genera.find(
    genus => genus.language.name === 'en'
  )?.genus || '';

  const nextDescription = () => {
    setCurrentDescriptionIndex((prev) => 
      prev === englishDescriptions.length - 1 ? 0 : prev + 1
    );
  };

  const prevDescription = () => {
    setCurrentDescriptionIndex((prev) => 
      prev === 0 ? englishDescriptions.length - 1 : prev - 1
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Description */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Book className="mr-2" size={20} />
            Description
          </h3>
          {englishDescriptions.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={prevDescription}
                className="p-1 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors"
                title="Previous description"
              >
                <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {currentDescriptionIndex + 1} of {englishDescriptions.length}
              </span>
              <button
                onClick={nextDescription}
                className="p-1 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors"
                title="Next description"
              >
                <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
        
        <div className="relative">
          {englishDescriptions.length > 0 ? (
            <div className="transition-all duration-300 ease-in-out">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {englishDescriptions[currentDescriptionIndex]?.flavor_text.replace(/\f/g, ' ')}
              </p>
              {englishDescriptions.length > 1 && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    From: {englishDescriptions[currentDescriptionIndex]?.version.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <div className="flex space-x-1">
                    {englishDescriptions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentDescriptionIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentDescriptionIndex
                            ? 'bg-blue-500 dark:bg-blue-400'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                        title={`View description from ${englishDescriptions[index]?.version.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No description available</p>
          )}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">The {englishGenus}</p>
      </div>

      {/* Pokedex Data */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
          <Ruler className="mr-2" size={20} />
          Pokédex Data
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Height</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{(pokemon.height / 10).toFixed(1)} m</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Weight</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{(pokemon.weight / 10).toFixed(1)} kg</p>
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
          <Star className="mr-2" size={20} />
          Abilities
        </h3>
        <div className="space-y-3">
          {pokemon.abilities.map((ability, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                ability.is_hidden 
                  ? 'bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-purple-900/30 border-purple-300 dark:border-purple-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                  : 'bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`font-semibold ${ability.is_hidden ? 'text-purple-800 dark:text-purple-200' : 'text-gray-900 dark:text-gray-100'}`}>
                  {formatPokemonName(ability.ability.name)}
                </span>
                {ability.is_hidden && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-purple-600 dark:text-purple-300 font-medium">Rare Ability</span>
                  </div>
                )}
              </div>
              {ability.is_hidden && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-md animate-pulse">
                    ✨ Hidden
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Training */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Zap className="mr-2" size={20} />
          Training
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">EV Yield</span>
            <div className="space-y-1">
              {pokemon.stats.filter(stat => stat.effort > 0).length > 0 ? (
                pokemon.stats.filter(stat => stat.effort > 0).map((stat, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      +{stat.effort} {formatPokemonName(stat.stat.name)}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-700 dark:text-gray-300">No EV yield</span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Catch Rate</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{species.capture_rate}</p>
            <div className="space-y-1">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>🔴 Poké Ball:</span>
                  <span className="font-medium">{((species.capture_rate / 255) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>💙 Great Ball:</span>
                  <span className="font-medium">{Math.min(((species.capture_rate / 255) * 100 * 1.5), 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>💜 Ultra Ball:</span>
                  <span className="font-medium">{Math.min(((species.capture_rate / 255) * 100 * 2), 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🖤 Master Ball:</span>
                  <span className="font-medium">100%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Base Friendship</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{species.base_happiness}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Base Exp.</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{pokemon.base_experience}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Growth Rate</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
              {GROWTH_RATES[species.growth_rate.name] || formatPokemonName(species.growth_rate.name)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Zap className="mr-2" size={20} />
          Base Stats
        </h3>
        <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 rounded-lg p-1 border border-white/30 dark:border-gray-700/30">
          <button
            onClick={() => setStatChartVariant('horizontal')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              statChartVariant === 'horizontal'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            title="Horizontal chart view"
          >
            <BarChart size={16} />
            <span>Bars</span>
          </button>
          <button
            onClick={() => setStatChartVariant('radial')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              statChartVariant === 'radial'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            title="Radial chart view"
          >
            <Activity size={16} />
            <span>Radar</span>
          </button>
        </div>
      </div>
      <StatChart stats={pokemon.stats} variant={statChartVariant} />
    </div>
  );

  const renderTypeDefensesTab = () => (
    <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
        <Shield className="mr-2" size={20} />
        Type Defenses
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(typeEffectiveness).map(([type, multiplier]) => {
          let bgColor = 'bg-gray-100 dark:bg-gray-700';
          let textColor = 'text-gray-700 dark:text-gray-300';
          let borderColor = 'border-gray-200 dark:border-gray-600';
          
          if (multiplier === 0) {
            bgColor = 'bg-gray-500 dark:bg-gray-600';
            textColor = 'text-white';
            borderColor = 'border-gray-400 dark:border-gray-500';
          } else if (multiplier === 0.25) {
            bgColor = 'bg-green-600 dark:bg-green-700';
            textColor = 'text-white';
            borderColor = 'border-green-500 dark:border-green-600';
          } else if (multiplier === 0.5) {
            bgColor = 'bg-green-400 dark:bg-green-500';
            textColor = 'text-white';
            borderColor = 'border-green-300 dark:border-green-400';
          } else if (multiplier === 2) {
            bgColor = 'bg-red-400 dark:bg-red-500';
            textColor = 'text-white';
            borderColor = 'border-red-300 dark:border-red-400';
          } else if (multiplier === 4) {
            bgColor = 'bg-red-600 dark:bg-red-700';
            textColor = 'text-white';
            borderColor = 'border-red-500 dark:border-red-600';
          }
          
          return (
            <div key={type} className={`${bgColor} ${textColor} p-4 rounded-lg text-center text-sm border ${borderColor} transition-transform hover:scale-105`} title={`${formatPokemonName(type)} - ${multiplier}× damage`}>
              <div className="flex flex-col items-center justify-center space-y-2">
                <TypeIcon type={type} size={96} />
                <div className="text-xs font-semibold opacity-90">{multiplier}×</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBreedingTab = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Baby className="mr-2" size={20} />
          Breeding
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Egg Groups</span>
            <div className="space-y-2">
              {species.egg_groups.map((group, index) => (
                <div key={index} className="inline-block mr-2 mb-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium">
                    {EGG_GROUP_NAMES[group.name] || formatPokemonName(group.name)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Gender Ratio</span>
            <div className="space-y-2">
              {species.gender_rate === -1 ? (
                <div className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm font-medium inline-block">
                  Genderless
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{((8 - species.gender_rate) / 8 * 100).toFixed(1)}% ♂</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{(species.gender_rate / 8 * 100).toFixed(1)}% ♀</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Egg Cycles</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{species.hatch_counter}</p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Base Happiness</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{species.base_happiness}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEvolutionTab = () => {
    const renderEvolutionChain = (chain: EvolutionChainLink, level = 0) => {
      const pokemonId = getPokemonId(chain.species.url);
      
      return (
        <div key={chain.species.name} className={`${level > 0 ? 'ml-8' : ''}`}>
          <div className="flex items-center space-x-6 mb-6">
            <button
              onClick={() => router.push(`/pokemon/${pokemonId}`)}
              className="text-center p-4 glass rounded-xl border border-white/20 dark:border-gray-700/30 hover:scale-105 transition-transform duration-200 cursor-pointer hover:bg-white/30 dark:hover:bg-gray-700/30"
              title={`View ${formatPokemonName(chain.species.name)} details`}
            >
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                alt={chain.species.name}
                width={80}
                height={80}
                className="mx-auto"
              />
              <p className="font-semibold mt-2 text-gray-900 dark:text-gray-100">{formatPokemonName(chain.species.name)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">#{pokemonId.toString().padStart(3, '0')}</p>
            </button>
            
            {chain.evolution_details.length > 0 && (
              <div className="flex-1">
                <div className="flex items-center">
                  <ArrowRight className="text-gray-400 dark:text-gray-500 mr-4" size={24} />
                  <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30">
                    {chain.evolution_details.map((detail: EvolutionDetail, index: number) => (
                      <div key={index} className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {detail.min_level && <p className="font-medium">Level {detail.min_level}</p>}
                        {detail.item && <p className="font-medium">Use {formatPokemonName(detail.item.name)}</p>}
                        {detail.min_happiness && <p className="font-medium">Happiness ≥ {detail.min_happiness}</p>}
                        {detail.time_of_day && <p className="font-medium">{formatPokemonName(detail.time_of_day)}</p>}
                        {detail.trigger && <p className="font-medium">{formatPokemonName(detail.trigger.name)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {chain.evolves_to.map((evolution: EvolutionChainLink) => renderEvolutionChain(evolution, level + 1))}
        </div>
      );
    };

    const renderMegaEvolutions = () => {
      // Show loading or content regardless for debugging
      if (megaEvolutionsLoading) {
        return (
          <div className="mt-8 pt-6 border-t border-white/20 dark:border-gray-700/30">
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Star className="mr-2 text-yellow-500" size={18} />
                Alternative Forms (Loading...)
              </h4>
            </div>
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          </div>
        );
      }
      
      // Always show the section for debugging, even if no mega evolutions
      return (
        <div className="mt-8 pt-6 border-t border-white/20 dark:border-gray-700/30">
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Star className="mr-2 text-yellow-500" size={18} />
              Alternative Forms (Debug: {megaEvolutions.length} found)
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Mega Evolutions, Gigantamax forms, and other special variants
            </p>
          </div>
          
          {megaEvolutions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No mega evolutions found. Check console for debug info.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {megaEvolutions.map((mega) => {
              const baseStatTotal = mega.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
              return (
                <button
                  key={mega.id}
                  onClick={() => {
                    setSelectedMegaEvolution(mega);
                    setShowMegaModal(true);
                  }}
                  className="text-center p-4 glass rounded-xl border border-white/20 dark:border-gray-700/30 hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-white/30 dark:hover:bg-gray-700/30 hover:shadow-lg flex flex-col"
                  title={`View ${formatPokemonName(mega.name)} details`}
                >
                  {/* Badge at top */}
                  <div className={`self-center text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-pulse mb-3 ${
                    mega.name.includes('mega') ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    mega.name.includes('gmax') ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    mega.name.includes('primal') ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    mega.name.includes('ultra') ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                    'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}>
                    {mega.name.includes('mega') ? 'MEGA' : 
                     mega.name.includes('gmax') ? 'GMAX' :
                     mega.name.includes('primal') ? 'PRIMAL' :
                     mega.name.includes('ultra') ? 'ULTRA' : 'FORM'}
                  </div>

                  {/* Pokemon info */}
                  <div className="flex-1 flex flex-col justify-center mb-3">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{formatPokemonName(mega.name)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">#{mega.id.toString().padStart(3, '0')}</p>
                    <div className="flex flex-col items-center gap-1 mt-2">
                      {mega.types.map((type) => (
                        <TypeIcon key={type.type.name} type={type.type.name} size={96} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      BST: {baseStatTotal}
                    </p>
                  </div>

                  {/* Images at bottom */}
                  <div className="flex justify-center space-x-3">
                    {/* Normal Form */}
                    <div className="relative">
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${mega.id}.png`}
                        alt={mega.name}
                        width={60}
                        height={60}
                        className="transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mega.id}.png`;
                        }}
                      />
                    </div>
                    
                    {/* Shiny Form */}
                    <div className="relative">
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${mega.id}.png`}
                        alt={`Shiny ${mega.name}`}
                        width={60}
                        height={60}
                        className="transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${mega.id}.png`;
                        }}
                      />
                      {/* Shiny sparkle indicator */}
                      <div className="absolute -top-1 -right-1">
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                          <span className="text-white text-xs font-bold">✨</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          )}
        </div>
      );
    };

    return (
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
          <Users className="mr-2" size={20} />
          Evolution Chart
        </h3>
        {evolutionChain ? (
          <div className="space-y-6">
            {renderEvolutionChain(evolutionChain.chain)}
            {renderMegaEvolutions()}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Loading evolution data...</p>
        )}
      </div>
    );
  };

  const renderMovesTab = () => {
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
      
      const moveDetail = moveDetails[moveName];
      if (moveDetail && !('loading' in moveDetail)) {
        setSelectedMove(moveDetail as Move);
        setShowMoveModal(true);
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
      React.useEffect(() => {
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
      React.useEffect(() => {
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

  const renderLocationsTab = () => {
    if (encountersLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading encounter data..." />
        </div>
      );
    }

    if (encounters.length === 0) {
      return (
        <div className="glass rounded-xl p-8 border border-white/20 dark:border-gray-700/30 text-center">
          <MapPin className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Wild Encounters
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This Pokémon cannot be found in the wild. It may be obtained through:
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30">
              <div className="text-2xl mb-2">🎁</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Gift/Event</div>
              <div className="text-gray-600 dark:text-gray-400">Special events or NPCs</div>
            </div>
            <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30">
              <div className="text-2xl mb-2">🥚</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Breeding</div>
              <div className="text-gray-600 dark:text-gray-400">Hatched from eggs</div>
            </div>
            <div className="glass rounded-lg p-4 border border-white/20 dark:border-gray-700/30">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Evolution</div>
              <div className="text-gray-600 dark:text-gray-400">Evolved from other Pokémon</div>
            </div>
          </div>
        </div>
      );
    }

    // Group encounters by game version
    const encountersByGame: Record<string, typeof encounters> = {};
    encounters.forEach(encounter => {
      encounter.version_details.forEach(versionDetail => {
        const game = versionDetail.version.name;
        if (!encountersByGame[game]) {
          encountersByGame[game] = [];
        }
        encountersByGame[game].push({
          ...encounter,
          version_details: [versionDetail]
        });
      });
    });

    // Create a mapping for individual game order and generation - now including ALL games
    const gameOrderMap: Record<string, { order: number; generation: number }> = {
      'red': { order: 1, generation: 1 }, 'blue': { order: 1, generation: 1 }, 'yellow': { order: 2, generation: 1 },
      'gold': { order: 3, generation: 2 }, 'silver': { order: 3, generation: 2 }, 'crystal': { order: 4, generation: 2 },
      'ruby': { order: 5, generation: 3 }, 'sapphire': { order: 5, generation: 3 }, 'emerald': { order: 6, generation: 3 },
      'firered': { order: 7, generation: 3 }, 'leafgreen': { order: 7, generation: 3 },
      'colosseum': { order: 8, generation: 3 }, 'xd': { order: 9, generation: 3 },
      'diamond': { order: 10, generation: 4 }, 'pearl': { order: 10, generation: 4 }, 'platinum': { order: 11, generation: 4 },
      'heartgold': { order: 12, generation: 4 }, 'soulsilver': { order: 12, generation: 4 },
      'black': { order: 13, generation: 5 }, 'white': { order: 13, generation: 5 }, 'black-2': { order: 14, generation: 5 }, 'white-2': { order: 14, generation: 5 },
      'x': { order: 15, generation: 6 }, 'y': { order: 15, generation: 6 },
      'omega-ruby': { order: 16, generation: 6 }, 'alpha-sapphire': { order: 16, generation: 6 },
      'sun': { order: 17, generation: 7 }, 'moon': { order: 17, generation: 7 },
      'ultra-sun': { order: 18, generation: 7 }, 'ultra-moon': { order: 18, generation: 7 },
      'lets-go-pikachu': { order: 19, generation: 7 }, 'lets-go-eevee': { order: 19, generation: 7 },
      'sword': { order: 20, generation: 8 }, 'shield': { order: 20, generation: 8 },
      'the-isle-of-armor': { order: 21, generation: 8 }, 'the-crown-tundra': { order: 22, generation: 8 },
      'brilliant-diamond': { order: 23, generation: 8 }, 'shining-pearl': { order: 23, generation: 8 },
      'legends-arceus': { order: 24, generation: 8 },
      'scarlet': { order: 25, generation: 9 }, 'violet': { order: 25, generation: 9 },
      'the-teal-mask': { order: 26, generation: 9 }, 'the-indigo-disk': { order: 27, generation: 9 }
    };

    // Function to get display name for games - now including ALL games
    const getGameDisplayName = (gameName: string): string => {
      const displayNames: Record<string, string> = {
        'red': 'Red', 'blue': 'Blue', 'yellow': 'Yellow',
        'gold': 'Gold', 'silver': 'Silver', 'crystal': 'Crystal',
        'ruby': 'Ruby', 'sapphire': 'Sapphire', 'emerald': 'Emerald',
        'firered': 'FireRed', 'leafgreen': 'LeafGreen',
        'colosseum': 'Colosseum', 'xd': 'XD: Gale of Darkness',
        'diamond': 'Diamond', 'pearl': 'Pearl', 'platinum': 'Platinum',
        'heartgold': 'HeartGold', 'soulsilver': 'SoulSilver',
        'black': 'Black', 'white': 'White', 'black-2': 'Black 2', 'white-2': 'White 2',
        'x': 'X', 'y': 'Y',
        'omega-ruby': 'Omega Ruby', 'alpha-sapphire': 'Alpha Sapphire',
        'sun': 'Sun', 'moon': 'Moon',
        'ultra-sun': 'Ultra Sun', 'ultra-moon': 'Ultra Moon',
        'lets-go-pikachu': "Let's Go Pikachu", 'lets-go-eevee': "Let's Go Eevee",
        'sword': 'Sword', 'shield': 'Shield',
        'the-isle-of-armor': 'The Isle of Armor', 'the-crown-tundra': 'The Crown Tundra',
        'brilliant-diamond': 'Brilliant Diamond', 'shining-pearl': 'Shining Pearl',
        'legends-arceus': 'Legends: Arceus',
        'scarlet': 'Scarlet', 'violet': 'Violet',
        'the-teal-mask': 'The Teal Mask', 'the-indigo-disk': 'The Indigo Disk'
      };
      return displayNames[gameName] || gameName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Get all games that have encounter data
    const gamesWithEncounters = Object.keys(encountersByGame).sort((a, b) => {
      const infoA = gameOrderMap[a] || { order: 999, generation: 999 };
      const infoB = gameOrderMap[b] || { order: 999, generation: 999 };
      
      if (infoA.generation !== infoB.generation) {
        return infoA.generation - infoB.generation;
      }
      if (infoA.order !== infoB.order) {
        return infoA.order - infoB.order;
      }
      return a.localeCompare(b);
    });

    // Define all available games for filtering (even those without encounter data)
    const allAvailableGames = Object.keys(gameOrderMap).sort((a, b) => {
      const infoA = gameOrderMap[a];
      const infoB = gameOrderMap[b];
      
      if (infoA.generation !== infoB.generation) {
        return infoA.generation - infoB.generation;
      }
      if (infoA.order !== infoB.order) {
        return infoA.order - infoB.order;
      }
      return a.localeCompare(b);
    });

    // Group all games by generation for display (not just those with encounters)
    const allGamesByGeneration: Record<number, string[]> = {};
    allAvailableGames.forEach(game => {
      const generation = gameOrderMap[game]?.generation || 999;
      if (!allGamesByGeneration[generation]) {
        allGamesByGeneration[generation] = [];
      }
      allGamesByGeneration[generation].push(game);
    });

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <MapPin className="mr-2" size={20} />
                Wild Encounters
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Locations where this Pokémon can be found in the wild
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl mb-2">🗺️</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {gamesWithEncounters.length} game{gamesWithEncounters.length !== 1 ? 's' : ''} with data
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {encounters.length} location{encounters.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Game Version Filter */}
        <div className="glass rounded-xl p-4 border border-white/20 dark:border-gray-700/30">
          <div className="flex items-center space-x-2 mb-3">
            <Filter size={16} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Game:</span>
          </div>
          
          {/* All Games button */}
          <div className="mb-4">
            <button
              onClick={() => setSelectedVersionGroup('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedVersionGroup === ''
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
              }`}
            >
              🎮 All Games ({gamesWithEncounters.length} with data)
            </button>
          </div>

          {/* Games grouped by generation */}
          <div className="space-y-3">
            {Object.keys(allGamesByGeneration)
              .map(Number)
              .sort((a, b) => a - b)
              .map(generation => (
                <div key={generation}>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <span className="mr-2">✨</span>
                    Generation {generation === 999 ? 'Other' : generation}
                  </div>
                  <div className="flex flex-wrap gap-2 pl-4">
                    {allGamesByGeneration[generation].map(game => {
                      const hasEncounterData = encountersByGame[game];
                      const hasSupplementalData = pokemon && hasSupplementalDataForGame(pokemon.id, game);
                      const hasAnyData = hasEncounterData || hasSupplementalData;
                      
                      return (
                        <button
                          key={game}
                          onClick={() => setSelectedVersionGroup(game)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                            selectedVersionGroup === game
                              ? 'bg-blue-500 text-white shadow-md'
                              : hasAnyData
                              ? 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
                              : 'bg-gray-200/50 dark:bg-gray-700/30 text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-60'
                          }`}
                          disabled={!hasAnyData}
                          title={hasAnyData ? undefined : 'No encounter data available for this game'}
                        >
                          {getGameDisplayName(game)}
                          {!hasAnyData && (
                            <span className="ml-1 text-xs">🚫</span>
                          )}
                          {hasSupplementalData && !hasEncounterData && (
                            <span className="ml-1 text-xs" title="Curated data available">✨</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Location Search */}
        {encounters.length > 5 && (
          <div className="glass rounded-xl p-4 border border-white/20 dark:border-gray-700/30">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Locations:</span>
            </div>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by location name..."
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        )}

        {/* Encounters by Game */}
        {gamesWithEncounters
          .filter(game => !selectedVersionGroup || selectedVersionGroup === game)
          .map(game => {
            // Filter encounters by location name if search is active
            const filteredEncounters = encountersByGame[game].filter(encounter => {
              if (!locationFilter) return true;
              const locationArea = locationDetails[encounter.location_area.name];
              const locationName = formatLocationName(encounter.location_area.name);
              const mainLocationName = locationArea?.location.name ? formatLocationName(locationArea.location.name) : '';
              
              return locationName.toLowerCase().includes(locationFilter.toLowerCase()) ||
                     mainLocationName.toLowerCase().includes(locationFilter.toLowerCase());
            });

            if (filteredEncounters.length === 0) return null;

            return (
            <div key={game} className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <Gamepad2 className="mr-2" size={18} />
                  Pokémon {getGameDisplayName(game)}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300">
                    Gen {gameOrderMap[game]?.generation || '?'}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredEncounters.length} location{filteredEncounters.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredEncounters.map((encounter, index) => {
                  const locationArea = locationDetails[encounter.location_area.name];
                  const locationName = formatLocationName(encounter.location_area.name);
                  
                  return (
                    <div key={index} className="bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 border border-white/20 dark:border-gray-700/30 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="mr-2">📍</span>
                            {locationArea?.location.name ? formatLocationName(locationArea.location.name) : locationName}
                          </h5>
                          {locationArea?.location.name && locationArea.location.name !== encounter.location_area.name && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                              Area: {locationName}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max Rate</div>
                          <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg">
                            <div className="font-bold text-green-700 dark:text-green-300 text-sm">
                              {formatEncounterRate(encounter.version_details[0].max_chance)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {encounter.version_details[0].encounter_details.map((detail, detailIndex) => {
                          const methodInfo = ENCOUNTER_METHODS[detail.method.name] || ENCOUNTER_METHODS.walk;
                          
                          return (
                            <div key={detailIndex} className="bg-white/20 dark:bg-gray-700/20 rounded-lg p-3 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{methodInfo.icon}</span>
                                  <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                    {methodInfo.name}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                    {typeof detail.chance === 'number' ? `${detail.chance}%` : detail.chance}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600 dark:text-gray-400">Level Range:</span>
                                  <span className="text-gray-900 dark:text-gray-100 font-medium px-2 py-1 bg-white/20 dark:bg-gray-800/20 rounded">
                                    {detail.min_level === detail.max_level ? 
                                      `Lv. ${detail.min_level}` : 
                                      `Lv. ${detail.min_level}-${detail.max_level}`
                                    }
                                  </span>
                                </div>
                                
                                {detail.condition_values.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-white/20 dark:border-gray-600/20">
                                    <div className="text-gray-600 dark:text-gray-400 mb-1">Conditions:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {detail.condition_values.map((condition, condIndex) => {
                                        const conditionInfo = ENCOUNTER_CONDITIONS[condition.name] || ENCOUNTER_CONDITIONS.time;
                                        return (
                                          <span
                                            key={condIndex}
                                            className="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border"
                                            style={{ 
                                              backgroundColor: `${conditionInfo.color}20`,
                                              borderColor: `${conditionInfo.color}40`,
                                              color: conditionInfo.color
                                            }}
                                          >
                                            <span>{conditionInfo.icon}</span>
                                            <span>{conditionInfo.name}</span>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })}

        {/* Message for games without encounter data */}
        {selectedVersionGroup && !encountersByGame[selectedVersionGroup] && (
          <div>
            {pokemon && hasSupplementalDataForGame(pokemon.id, selectedVersionGroup) ? (
              // Show supplemental data
              <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <Gamepad2 className="mr-2" size={18} />
                    Pokémon {getGameDisplayName(selectedVersionGroup)}
                    <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-xs font-medium text-yellow-700 dark:text-yellow-300">
                      Curated Data
                    </span>
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300">
                      Gen {gameOrderMap[selectedVersionGroup]?.generation || '?'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>✨ Curated Data:</strong> This encounter information has been manually curated from official sources 
                    since detailed encounter data for Generation 8+ games is not yet available in PokéAPI.
                  </p>
                </div>

                {/* Render supplemental encounter data here */}
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <p>Supplemental encounter display coming soon...</p>
                </div>
              </div>
            ) : (
              // Show no data message
              <div className="glass rounded-xl p-8 border border-white/20 dark:border-gray-700/30 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Encounter Data Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Pokémon {getGameDisplayName(selectedVersionGroup)} encounter data is not yet available in the database.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> PokéAPI currently has complete encounter data up to Generation 7 (Ultra Sun/Ultra Moon). 
                    Newer games like Sword/Shield, Scarlet/Violet, and others are in the system but encounter locations are still being added.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVersionGroup('')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  View All Available Games
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'stats', label: 'Base Stats', icon: Zap },
    { id: 'type-defenses', label: 'Type Defenses', icon: Shield },
    { id: 'breeding', label: 'Breeding', icon: Heart },
    { id: 'evolution', label: 'Evolution', icon: Users },
    { id: 'moves', label: 'Moves Learned', icon: Gamepad2 },
    { id: 'locations', label: 'Locations', icon: MapPin },
  ];

  return (
    <div className="min-h-screen">
      {/* Background */}
      <HeroBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div 
          className="relative h-80 overflow-hidden"
          style={{
            background: pokemon.types.length > 0 
              ? `linear-gradient(135deg, ${TYPE_COLORS[pokemon.types[0].type.name]} 0%, ${TYPE_COLORS[pokemon.types[pokemon.types.length - 1].type.name] || TYPE_COLORS[pokemon.types[0].type.name]} 100%)`
              : 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)'
          }}
        >
          {/* Floating pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%223%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          
          <div className="container mx-auto px-4 py-6 relative z-10">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-white hover:text-white/80 transition-colors mb-4 glass-button rounded-xl px-4 py-2 border border-white/20"
            >
              <ChevronLeft size={24} className="mr-1" />
              Back to Pokédex
            </button>
            
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">{formatPokemonName(pokemon.name)}</h1>
                <p className="text-xl opacity-90 drop-shadow-md">#{pokemon.id.toString().padStart(3, '0')}</p>
                <div className="flex space-x-2 mt-3">
                  {pokemon.types.map((type, index) => (
                    <TypeIcon key={index} type={type.type.name} size={96} />
                  ))}
                </div>
              </div>
              
              <div className="relative flex space-x-6">
                {/* Normal Version */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                  <button
                    onClick={() => setShowSpritesModal(true)}
                    className="relative z-10 group"
                    title="Click to view all sprites"
                  >
                    <Image
                      src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default || '/placeholder-pokemon.svg'}
                      alt={`${pokemon.name} normal`}
                      width={180}
                      height={180}
                      className="drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                    {/* Overlay with hint */}
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs font-medium text-gray-900 dark:text-gray-100">
                        View All Sprites
                      </div>
                    </div>
                  </button>
                  <div className="text-center mt-2">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                      Normal
                    </span>
                  </div>
                </div>

                {/* Shiny Version */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-2xl animate-pulse"></div>
                  <button
                    onClick={() => setShowSpritesModal(true)}
                    className="relative z-10 group"
                    title="Click to view all sprites"
                  >
                    <Image
                      src={pokemon.sprites.other['official-artwork']?.front_shiny || pokemon.sprites.front_shiny || '/placeholder-pokemon.svg'}
                      alt={`${pokemon.name} shiny`}
                      width={180}
                      height={180}
                      className="drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                    {/* Shiny sparkle effect */}
                    <div className="absolute top-2 right-2 text-yellow-300 animate-pulse">
                      ✨
                    </div>
                    {/* Overlay with hint */}
                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs font-medium text-gray-900 dark:text-gray-100">
                        View All Sprites
                      </div>
                    </div>
                  </button>
                  <div className="text-center mt-2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full text-white text-sm font-medium shadow-lg">
                      ✨ Shiny
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass border-b border-white/20 dark:border-gray-700/30 sticky top-0 z-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <nav className="flex space-x-2 md:space-x-8 overflow-x-auto tab-navigation pb-2 md:pb-0 flex-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-1 md:space-x-2 py-3 md:py-4 px-3 md:px-2 border-b-2 transition-all duration-200 whitespace-nowrap min-w-fit ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-t-lg'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-t-lg'
                      }`}
                    >
                      <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                      <span className="font-medium text-sm md:text-base">{tab.label}</span>
                      {tab.id === 'locations' && encountersLoading && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
              
              {/* Quick Moves Tab Button for Mobile */}
              <div className="md:hidden ml-2">
                <button
                  onClick={() => setActiveTab('moves')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-all duration-200 ${
                    activeTab === 'moves'
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 text-gray-600 dark:text-gray-400'
                  }`}
                  title="View Moves"
                >
                  <Gamepad2 size={16} />
                  <span className="text-xs font-medium">Moves</span>
                </button>
              </div>
            </div>
            
            {/* Scroll hint for mobile */}
            <div className="md:hidden text-center py-1">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
                <span>←</span>
                <span>Scroll for all tabs or use quick button</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'stats' && renderStatsTab()}
          {activeTab === 'type-defenses' && renderTypeDefensesTab()}
          {activeTab === 'breeding' && renderBreedingTab()}
          {activeTab === 'evolution' && renderEvolutionTab()}
          {activeTab === 'moves' && renderMovesTab()}
          {activeTab === 'locations' && renderLocationsTab()}
        </div>
        
      </div>
      
      {/* Sprites Modal */}
      <SpritesModal
        pokemon={pokemon}
        isOpen={showSpritesModal}
        onClose={() => setShowSpritesModal(false)}
      />
      
      {/* Move Detail Modal */}
      <MoveDetailModal
        move={selectedMove}
        isOpen={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setSelectedMove(null);
        }}
      />
      
      {/* Mega Evolution Modal */}
      <MegaEvolutionModal
        pokemon={selectedMegaEvolution}
        isOpen={showMegaModal}
        onClose={() => {
          setShowMegaModal(false);
          setSelectedMegaEvolution(null);
        }}
      />
    </div>
  );
};

export default PokemonDetail;
