// Check if there are alternative ways to get encounter data
const BASE_URL = 'https://pokeapi.co/api/v2';

async function investigateAlternatives() {
  try {
    console.log('Investigating alternative data sources for encounters...\n');
    
    // 1. Check if Pikachu's species data mentions anything about newer games
    console.log('=== Checking Pikachu Species Data ===');
    const speciesResponse = await fetch(`${BASE_URL}/pokemon-species/25`);
    const speciesData = await speciesResponse.json();
    
    console.log('Varieties:', speciesData.varieties.length);
    speciesData.varieties.forEach(variety => {
      console.log(`- ${variety.pokemon.name} (default: ${variety.is_default})`);
    });
    
    // 2. Check if there are location areas that mention newer games
    console.log('\n=== Checking Some Location Areas ===');
    
    // Let's check a few known locations to see if they have newer game data
    const locationTests = [
      'paldea-route-1-area', // Scarlet/Violet
      'galar-route-1-area', // Sword/Shield
      'wild-area-rolling-fields' // Sword/Shield
    ];
    
    for (const locationName of locationTests) {
      try {
        const locationResponse = await fetch(`${BASE_URL}/location-area/${locationName}`);
        if (locationResponse.ok) {
          const locationData = await locationResponse.json();
          console.log(`\n${locationName}:`);
          console.log(`- Pokemon encounters: ${locationData.pokemon_encounters.length}`);
          
          if (locationData.pokemon_encounters.length > 0) {
            // Check what games are mentioned
            const games = new Set();
            locationData.pokemon_encounters.forEach(encounter => {
              encounter.version_details.forEach(detail => {
                games.add(detail.version.name);
              });
            });
            console.log(`- Games mentioned: ${Array.from(games).join(', ')}`);
          }
        } else {
          console.log(`${locationName}: Not found (${locationResponse.status})`);
        }
      } catch (error) {
        console.log(`${locationName}: Error - ${error.message}`);
      }
    }
    
    // 3. Check if there are newer game versions that we might be missing
    console.log('\n=== Checking Game Versions Again ===');
    const versionsResponse = await fetch(`${BASE_URL}/version?limit=50`);
    const versionsData = await versionsResponse.json();
    
    const modernGames = versionsData.results.filter(version => 
      ['sword', 'shield', 'brilliant-diamond', 'shining-pearl', 'legends-arceus', 'scarlet', 'violet', 'the-teal-mask', 'the-indigo-disk'].includes(version.name)
    );
    
    console.log('Modern games in PokéAPI:');
    modernGames.forEach(game => {
      console.log(`- ${game.name}`);
    });
    
    // 4. Try to find ANY Pokémon that has encounter data in newer games
    console.log('\n=== Searching for Any Pokémon with Modern Game Encounters ===');
    
    // Let's try some Galar/Paldea native Pokémon
    const modernPokemon = [
      { id: 810, name: 'Grookey' },
      { id: 813, name: 'Scorbunny' }, 
      { id: 816, name: 'Sobble' },
      { id: 906, name: 'Sprigatito' },
      { id: 909, name: 'Fuecoco' },
      { id: 912, name: 'Quaxly' }
    ];
    
    for (const pokemon of modernPokemon) {
      try {
        const encounterResponse = await fetch(`${BASE_URL}/pokemon/${pokemon.id}/encounters`);
        const encounterData = await encounterResponse.json();
        
        if (encounterData.length > 0) {
          console.log(`\n${pokemon.name} HAS encounter data!`);
          
          const games = new Set();
          encounterData.forEach(encounter => {
            encounter.version_details.forEach(detail => {
              games.add(detail.version.name);
            });
          });
          console.log(`Games: ${Array.from(games).join(', ')}`);
          break; // Found one!
        } else {
          console.log(`${pokemon.name}: No encounters`);
        }
      } catch (error) {
        console.log(`${pokemon.name}: Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error in investigation:', error);
  }
}

investigateAlternatives();
