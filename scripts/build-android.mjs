import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
await mkdir('www/vendor',{recursive:true});
let html=await readFile('index.html','utf8');
const remote="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";
if(!html.includes(remote))throw Error('Three.js import not found; cannot create offline build');
html=html.replace(remote,'./vendor/three.module.js');
await writeFile('www/index.html',html);
await copyFile('node_modules/three/build/three.module.js','www/vendor/three.module.js');
console.log('Offline Android web assets built');
