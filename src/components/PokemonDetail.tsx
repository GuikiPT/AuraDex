'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Heart, Star, Zap, Shield, Users, Baby, ArrowRight, ChevronRight } from 'lucide-react';
import { Pokemon, PokemonSpecies, EvolutionChain, TypeEffectiveness, EvolutionChainLink, EvolutionDetail } from '@/types/pokemon';
import { pokemonApi, calculateTypeEffectiveness, formatPokemonName, getPokemonId } from '@/utils/pokemon-api';
import { TYPE_COLORS, EGG_GROUP_NAMES, GROWTH_RATES } from '@/constants/pokemon';
import TypeIcon from './TypeIcon';
import StatChart from './StatChart';
import LoadingSpinner from './LoadingSpinner';
import Footer from './Footer';
import SpritesModal from './SpritesModal';

interface PokemonDetailProps {
  pokemonId: string;
}

const PokemonDetail = ({ pokemonId }: PokemonDetailProps) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [typeEffectiveness, setTypeEffectiveness] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSpritesModal, setShowSpritesModal] = useState(false);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);
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

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Background */}
        <div className="fixed inset-0 bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 animate-gradient" />
        <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        
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
        <div className="fixed inset-0 bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 animate-gradient" />
        <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Description</h3>
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
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Pokédex Data</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Height</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{(pokemon.height / 10).toFixed(1)} m</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Weight</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{(pokemon.weight / 10).toFixed(1)} kg</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Base Experience</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{pokemon.base_experience}</p>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Capture Rate</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{species.capture_rate}</p>
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Abilities</h3>
        <div className="space-y-3">
          {pokemon.abilities.map((ability, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30">
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatPokemonName(ability.ability.name)}</span>
              {ability.is_hidden && (
                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-medium">Hidden</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Base Stats</h3>
      <StatChart stats={pokemon.stats} />
    </div>
  );

  const renderTypeDefensesTab = () => (
    <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Type Defenses</h3>
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
            <div key={type} className={`${bgColor} ${textColor} p-3 rounded-lg text-center text-sm border ${borderColor} transition-transform hover:scale-105`}>
              <div className="font-medium">{formatPokemonName(type)}</div>
              <div className="text-xs opacity-90 mt-1">{multiplier}×</div>
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

      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Zap className="mr-2" size={20} />
          Training
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Growth Rate</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
              {GROWTH_RATES[species.growth_rate.name] || formatPokemonName(species.growth_rate.name)}
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Base Experience</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{pokemon.base_experience}</p>
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
            <div className="text-center p-4 glass rounded-xl border border-white/20 dark:border-gray-700/30 hover:scale-105 transition-transform duration-200">
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                alt={chain.species.name}
                width={80}
                height={80}
                className="mx-auto"
              />
              <p className="font-semibold mt-2 text-gray-900 dark:text-gray-100">{formatPokemonName(chain.species.name)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">#{pokemonId.toString().padStart(3, '0')}</p>
            </div>
            
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

    return (
      <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Evolution Chart</h3>
        {evolutionChain ? (
          <div className="space-y-6">
            {renderEvolutionChain(evolutionChain.chain)}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Loading evolution data...</p>
        )}
      </div>
    );
  };

  const renderMovesTab = () => {
    const levelUpMoves = pokemon.moves
      .filter(move => move.version_group_details.some(detail => 
        detail.move_learn_method.name === 'level-up'
      ))
      .map(move => {
        const levelData = move.version_group_details.find(detail => 
          detail.move_learn_method.name === 'level-up'
        );
        return {
          ...move,
          level: levelData?.level_learned_at || 0
        };
      })
      .sort((a, b) => a.level - b.level);

    const tmMoves = pokemon.moves.filter(move => 
      move.version_group_details.some(detail => 
        detail.move_learn_method.name === 'machine'
      )
    );

    const eggMoves = pokemon.moves.filter(move => 
      move.version_group_details.some(detail => 
        detail.move_learn_method.name === 'egg'
      )
    );

    return (
      <div className="space-y-6">
        <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Level Up Moves</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Level</th>
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Move</th>
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {levelUpMoves.slice(0, 20).map((move, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-2 text-gray-900 dark:text-gray-100 font-medium">{move.level || '—'}</td>
                    <td className="py-3 px-2 font-semibold text-gray-900 dark:text-gray-100">{formatPokemonName(move.move.name)}</td>
                    <td className="py-3 px-2">
                      <span 
                        className="px-3 py-1 rounded-full text-xs text-white font-medium"
                        style={{ backgroundColor: TYPE_COLORS[move.move.name] || '#68D391' }}
                      >
                        {formatPokemonName(move.move.name)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {tmMoves.length > 0 && (
          <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">TM Moves</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tmMoves.slice(0, 15).map((move, index) => (
                <div key={index} className="glass-subtle rounded-lg px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 border border-white/30 dark:border-gray-700/30 hover:scale-105 transition-transform duration-200">
                  {formatPokemonName(move.move.name)}
                </div>
              ))}
            </div>
          </div>
        )}

        {eggMoves.length > 0 && (
          <div className="glass rounded-xl p-6 border border-white/20 dark:border-gray-700/30">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Egg Moves</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {eggMoves.map((move, index) => (
                <div key={index} className="glass-subtle rounded-lg px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 border border-white/30 dark:border-gray-700/30 hover:scale-105 transition-transform duration-200">
                  {formatPokemonName(move.move.name)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'stats', label: 'Base Stats', icon: Zap },
    { id: 'type-defenses', label: 'Type Defenses', icon: Shield },
    { id: 'breeding', label: 'Training & Breeding', icon: Heart },
    { id: 'evolution', label: 'Evolution', icon: Users },
    { id: 'moves', label: 'Moves', icon: Zap },
  ];

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 animate-gradient" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
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
              
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                <button
                  onClick={() => setShowSpritesModal(true)}
                  className="relative z-10 group"
                  title="Click to view all sprites"
                >
                  <Image
                    src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default || '/placeholder-pokemon.svg'}
                    alt={pokemon.name}
                    width={200}
                    height={200}
                    className="drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                  {/* Overlay with hint */}
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-sm font-medium text-gray-900 dark:text-gray-100">
                      View All Sprites
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass border-b border-white/20 dark:border-gray-700/30 sticky top-0 z-20">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
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
        </div>
        
        <Footer />
      </div>
      
      {/* Sprites Modal */}
      <SpritesModal
        pokemon={pokemon}
        isOpen={showSpritesModal}
        onClose={() => setShowSpritesModal(false)}
      />
    </div>
  );
};

export default PokemonDetail;
