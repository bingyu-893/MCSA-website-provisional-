const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const manifest=JSON.parse(fs.readFileSync('content/departments/secretariat-originals.json'));
assert.equal(manifest.files.length,10);
for(const item of manifest.files){const b=fs.readFileSync(item.file);assert.equal(b.length,item.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),item.sha256,item.file);}
for(const suffix of ['','-en']){const html=fs.readFileSync(`department-secretariat${suffix}.html`,'utf8');assert.doesNotMatch(html,/<script/i);assert.deepEqual([...html.matchAll(/secretariat\/(64\d)\.(?:png|jpeg)/g)].map(m=>Number(m[1])),Array.from({length:10},(_,i)=>640+i));for(const m of html.matchAll(/src="([^"]+)"/g))assert.ok(fs.existsSync(m[1]),m[1]);}
console.log('All ten originals verified; both static pages have ordered images and no runtime scripts.');
