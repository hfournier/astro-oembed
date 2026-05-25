import { writeFileSync } from 'fs';

const res = await fetch('https://oembed.com/providers.json');
if (!res.ok) throw new Error(`Failed to fetch providers: ${res.status}`);
const data = await res.json();
writeFileSync('src/data/providers.json', JSON.stringify(data, null, 2) + '\n');
console.warn('providers.json updated');
