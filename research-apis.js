// Research alternative Pokémon APIs and data sources
console.log('=== Alternative Pokémon APIs Research ===\n');

const alternativeAPIs = [
  {
    name: 'Pokémon Database (pokemondb.net)',
    description: 'Comprehensive data including modern games',
    url: 'https://pokemondb.net',
    hasAPI: 'No official API, but scrapeable',
    coverage: 'Complete through Gen 9',
    note: 'Would require web scraping'
  },
  {
    name: 'Serebii.net',
    description: 'Complete encounter data for all games',
    url: 'https://serebii.net',
    hasAPI: 'No official API',
    coverage: 'Complete through Gen 9',
    note: 'Would require web scraping'
  },
  {
    name: 'Bulbapedia API',
    description: 'Wikimedia-based Pokémon data',
    url: 'https://bulbapedia.bulbagarden.net/w/api.php',
    hasAPI: 'MediaWiki API available',
    coverage: 'Complete through Gen 9',
    note: 'Complex to parse, structured for wiki content'
  },
  {
    name: 'PokéAPI v2 (GraphQL)',
    description: 'Alternative PokéAPI endpoint',
    url: 'https://beta.pokeapi.co/graphql/v1beta',
    hasAPI: 'GraphQL endpoint',
    coverage: 'Same as REST API',
    note: 'Same data limitations as regular PokéAPI'
  },
  {
    name: 'Unofficial Pokémon APIs',
    description: 'Community-maintained APIs',
    examples: [
      'pokemon-species-data (GitHub)',
      'pokemon-go-api',
      'showdown-sets'
    ],
    coverage: 'Varies',
    note: 'Often focused on specific aspects'
  },
  {
    name: 'Game Data Extraction',
    description: 'Direct from game files',
    source: 'ROM/Game file parsing',
    coverage: 'Complete and accurate',
    note: 'Complex, legal considerations'
  }
];

console.log('Available Alternative Data Sources:\n');

alternativeAPIs.forEach((api, index) => {
  console.log(`${index + 1}. ${api.name}`);
  console.log(`   Description: ${api.description}`);
  console.log(`   URL: ${api.url || 'N/A'}`);
  console.log(`   API Available: ${api.hasAPI || 'Unknown'}`);
  console.log(`   Coverage: ${api.coverage || 'Unknown'}`);
  console.log(`   Note: ${api.note}`);
  if (api.examples) {
    console.log(`   Examples: ${api.examples.join(', ')}`);
  }
  console.log('');
});

console.log('=== Recommendations ===\n');

console.log('For complete encounter data in modern games, consider:');
console.log('');
console.log('1. **Short-term solution**: Create a supplemental data file');
console.log('   - Manually curate encounter data for popular Pokémon');
console.log('   - Focus on major locations and common encounters');
console.log('   - Use community sources like Serebii/Bulbapedia');
console.log('');
console.log('2. **Medium-term solution**: Web scraping');
console.log('   - Scrape Pokémon Database or Serebii');
console.log('   - Build a caching layer');
console.log('   - Keep data updated');
console.log('');
console.log('3. **Long-term solution**: Community data project');
console.log('   - Contribute to PokéAPI to add missing data');
console.log('   - Create open-source encounter database');
console.log('   - Collaborate with Pokémon community');
console.log('');

console.log('=== Testing Alternative Approaches ===\n');

// Let's test if we can get any useful data from other sources
async function testAlternatives() {
  console.log('Testing if we can access alternative data sources...\n');
  
  // Test 1: Check if PokéAPI has any newer location data we missed
  try {
    console.log('1. Testing PokéAPI location search...');
    const locationResponse = await fetch('https://pokeapi.co/api/v2/location?limit=1000');
    const locationData = await locationResponse.json();
    
    const modernLocations = locationData.results.filter(loc => 
      loc.name.includes('galar') || 
      loc.name.includes('paldea') || 
      loc.name.includes('hisui')
    );
    
    console.log(`   Found ${modernLocations.length} modern locations:`);
    modernLocations.slice(0, 10).forEach(loc => {
      console.log(`   - ${loc.name}`);
    });
    
    if (modernLocations.length > 10) {
      console.log(`   ... and ${modernLocations.length - 10} more`);
    }
  } catch (error) {
    console.log('   Error testing locations:', error.message);
  }
  
  console.log('');
  
  // Test 2: Check Bulbapedia API
  try {
    console.log('2. Testing Bulbapedia API...');
    const bulbaResponse = await fetch('https://bulbapedia.bulbagarden.net/w/api.php?action=query&format=json&titles=Pikachu_(Pokémon)&prop=extracts&exintro=true');
    
    if (bulbaResponse.ok) {
      console.log('   ✅ Bulbapedia API accessible');
      console.log('   Note: Would need complex parsing for encounter data');
    } else {
      console.log('   ❌ Bulbapedia API not accessible');
    }
  } catch (error) {
    console.log('   ❌ Error accessing Bulbapedia:', error.message);
  }
  
  console.log('');
  console.log('=== Conclusion ===');
  console.log('PokéAPI is currently the best structured API for Pokémon data,');
  console.log('but it lacks encounter data for Generation 8+ games.');
  console.log('');
  console.log('Best immediate solution: Create supplemental data for popular Pokémon');
  console.log('in modern games, while keeping the existing PokéAPI integration');
  console.log('for older games where data is complete.');
}

testAlternatives();
