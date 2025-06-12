const fs = require('fs');
const { execSync } = require('child_process');

const BASE_URL = 'https://raw.githubusercontent.com/r-avg/sv-encounterer/master/data';
const FILES = [
  'alfornada.json','asadodesert.json','c1.json','c2.json','casseroya.json','dalizapa.json','e1.json','e2.json','e3.json','es.json','glaseado.json','inletgrotto.json','n1.json','n2.json','n3.json','ns.json','pocopath.json','s1.json','s2.json','s3.json','s4.json','s5.json','s6.json','socarrat.json','ss.json','thicket.json','w1.json','w2.json','w3.json','ws.json'
];

function fetchJson(url) {
  try {
    let out = execSync(`curl -L --fail -s ${url}`, { encoding: 'utf8' });
    out = out.trim();
    if (!out.startsWith('{')) out = '{' + out;
    if (!out.endsWith('}')) out = out + '}';
    return JSON.parse(out);
  } catch (err) {
    console.error('Failed to parse', url);
    return null;
  }
}

(async () => {
  const pokemonMap = {};
  for (const file of FILES) {
    const url = `${BASE_URL}/${file}`;
    const json = fetchJson(url);
    if (!json || !json.biomes) continue;
    const location = file.replace('.json','');
    for (const [biome, mons] of Object.entries(json.biomes)) {
      for (const mon of mons) {
        const key = mon.toLowerCase();
        if (!pokemonMap[key]) pokemonMap[key] = [];
        pokemonMap[key].push({ location, biome });
      }
    }
  }
  fs.writeFileSync('src/data/sv-encounters.json', JSON.stringify(pokemonMap, null, 2));
  console.log('Saved sv-encounters.json with', Object.keys(pokemonMap).length, 'pokemon');
})();
