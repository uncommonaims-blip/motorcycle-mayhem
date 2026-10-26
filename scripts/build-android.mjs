import {mkdir,readFile,writeFile,copyFile,access} from 'node:fs/promises';
await mkdir('www/vendor',{recursive:true});
let html=await readFile('index.html','utf8');
const remote="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";
if(!html.includes(remote))throw Error('Three.js import not found; cannot create offline build');
html=html.replace(remote,'./vendor/three.module.js');
await writeFile('www/index.html',html);
await copyFile('node_modules/three/build/three.module.js','www/vendor/three.module.js');
await mkdir('www/assets',{recursive:true});
try{await access('assets/moto-funk.mp3');await copyFile('assets/moto-funk.mp3','www/assets/moto-funk.mp3');console.log('Moto Funk bundled into Android assets')}catch{console.warn('Moto Funk missing: add assets/moto-funk.mp3 to bundle the soundtrack')}
console.log('Offline Android web assets built');
