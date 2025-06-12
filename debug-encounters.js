// Debug script to check what game versions are available in PokéAPI
const BASE_URL = 'https://pokeapi.co/api/v2';

async function debugGameVersions() {
  try {
    console.log('Checking available game versions in PokéAPI...\n');
    
    // Check what versions are available
    const versionsResponse = await fetch(`${BASE_URL}/version?limit=100`);
    const versionsData = await versionsResponse.json();
    
    console.log('Available game versions:');
    versionsData.results.forEach((version, index) => {
      console.log(`${index + 1}. ${version.name}`);
    });
    
    console.log(`\nTotal versions: ${versionsData.results.length}`);
    
    // Check for modern games specifically
    const modernGameNames = ['sword', 'shield', 'brilliant-diamond', 'shining-pearl', 'legends-arceus', 'scarlet', 'violet'];
    const foundModernGames = versionsData.results.filter(version => 
      modernGameNames.includes(version.name)
    );
    
    console.log('\nModern games found in version list:');
    foundModernGames.forEach(game => {
      console.log(`- ${game.name}`);
    });
    
    if (foundModernGames.length === 0) {
      console.log('No modern games found in PokéAPI version list');
    }
    
    // Let's also check version groups
    console.log('\n--- Checking Version Groups ---');
    const versionGroupsResponse = await fetch(`${BASE_URL}/version-group?limit=100`);
    const versionGroupsData = await versionGroupsResponse.json();
    
    console.log('Available version groups:');
    versionGroupsData.results.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name}`);
    });
    
  } catch (error) {
    console.error('Error checking game versions:', error);
  }
}

debugGameVersions();
