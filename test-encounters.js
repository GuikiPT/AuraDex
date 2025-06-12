// Test script to verify encounter API endpoints
const BASE_URL = 'https://pokeapi.co/api/v2';

async function testEncounters() {
  try {
    console.log('Testing encounter endpoints...');
    
    // Test multiple Pokémon to see which ones have encounter data
    const testPokemon = [
      { id: 19, name: 'Rattata' },
      { id: 74, name: 'Geodude' },
      { id: 129, name: 'Magikarp' },
      { id: 16, name: 'Pidgey' },
      { id: 10, name: 'Caterpie' }
    ];
    
    for (const pokemon of testPokemon) {
      console.log(`\n--- Testing ${pokemon.name} (ID: ${pokemon.id}) encounters ---`);
      const response = await fetch(`${BASE_URL}/pokemon/${pokemon.id}/encounters`);
      const encounters = await response.json();
      console.log(`${pokemon.name} encounters count:`, encounters.length);
      
      if (encounters.length > 0) {
        console.log('Sample locations:');
        encounters.slice(0, 3).forEach((encounter, index) => {
          console.log(`  ${index + 1}. Location: ${encounter.location_area.name}`);
          const games = encounter.version_details.map(v => v.version.name);
          console.log(`     Games: ${games.join(', ')}`);
        });
        
        // Show unique games for this Pokémon
        const allGames = new Set();
        encounters.forEach(encounter => {
          encounter.version_details.forEach(version => {
            allGames.add(version.version.name);
          });
        });
        console.log(`     All games: ${Array.from(allGames).sort().join(', ')}`);
      } else {
        console.log('No encounters found');
      }
    }
    
  } catch (error) {
    console.error('Error testing encounters:', error);
  }
}

testEncounters();
