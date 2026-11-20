import {mkdir,readFile,writeFile,copyFile,access,cp} from 'node:fs/promises';
await mkdir('www/vendor',{recursive:true});
let html=await readFile('index.html','utf8');
const remote="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";
if(!html.includes(remote))throw Error('Three.js import not found; cannot create offline build');
html=html.replace(remote,'./vendor/three.module.js');
// The live Pages version uses the root-level chase track; the offline APK bundles it in assets.
html=html.replace('src="./hot-pursuit.mp3"','src="./assets/hot-pursuit.mp3"');
await writeFile('www/index.html',html);
await copyFile('node_modules/three/build/three.module.js','www/vendor/three.module.js');
// Keep the published web bundle in sync with the game's referenced artwork and sound files.
// Previously only three MP3s were copied, leaving the splash logo and billboards missing.
await cp('assets','www/assets',{recursive:true,force:true});
for(const track of ['moto-funk.mp3','hot-pursuit.mp3','psilocybin-skyway.mp3']){let source;for(const candidate of ['assets/'+track,track]){try{await access(candidate);source=candidate;break}catch{}}if(!source)throw Error('Missing required soundtrack: '+track);await copyFile(source,'www/assets/'+track);console.log('Bundled '+track+' from '+source)}
console.log('Offline Android web assets built');
