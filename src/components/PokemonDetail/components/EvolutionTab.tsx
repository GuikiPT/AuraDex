import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, Users, Star } from 'lucide-react';
import { Pokemon, EvolutionChain, EvolutionChainLink, EvolutionDetail } from '@/types/pokemon';
import { formatPokemonName, getPokemonId } from '@/utils/pokemon-api';
import LoadingSpinner from '../../LoadingSpinner';
import TypeIcon from '../../TypeIcon';

interface EvolutionTabProps {
  evolutionChain: EvolutionChain | null;
  megaEvolutions: Pokemon[];
  megaEvolutionsLoading: boolean;
  onMegaEvolutionClick: (pokemon: Pokemon) => void;
}

export const EvolutionTab: React.FC<EvolutionTabProps> = ({
  evolutionChain,
  megaEvolutions,
  megaEvolutionsLoading,
  onMegaEvolutionClick
}) => {
  const router = useRouter();

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
    
    return (
      <div className="mt-8 pt-6 border-t border-white/20 dark:border-gray-700/30">
        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Star className="mr-2 text-yellow-500" size={18} />
            Alternative Forms {megaEvolutions.length > 0 && `(${megaEvolutions.length})`}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Mega Evolutions, Gigantamax forms, and other special variants
          </p>
        </div>
        
        {megaEvolutions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No alternative forms available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {megaEvolutions.map((mega) => {
              const baseStatTotal = mega.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
              return (
                <button
                  key={mega.id}
                  onClick={() => onMegaEvolutionClick(mega)}
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
