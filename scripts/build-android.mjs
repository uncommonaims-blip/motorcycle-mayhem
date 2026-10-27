import {mkdir,readFile,writeFile,copyFile,access} from 'node:fs/promises';
await mkdir('www/vendor',{recursive:true});
let html=await readFile('index.html','utf8');
const remote="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";
if(!html.includes(remote))throw Error('Three.js import not found; cannot create offline build');
html=html.replace(remote,'./vendor/three.module.js');
// The live Pages version uses the root-level chase track; the offline APK bundles it in assets.
html=html.replace('src="./hot-pursuit.mp3"','src="./assets/hot-pursuit.mp3"');
await writeFile('www/index.html',html);
await copyFile('node_modules/three/build/three.module.js','www/vendor/three.module.js');
await mkdir('www/assets',{recursive:true});
for(const track of ['moto-funk.mp3','hot-pursuit.mp3','psilocybin-skyway.mp3']){let source;for(const candidate of ['assets/'+track,track]){try{await access(candidate);source=candidate;break}catch{}}if(!source)throw Error('Missing required soundtrack: '+track);await copyFile(source,'www/assets/'+track);console.log('Bundled '+track+' from '+source)}
console.log('Offline Android web assets built');
