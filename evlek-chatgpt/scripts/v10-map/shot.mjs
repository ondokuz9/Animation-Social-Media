import {createRequire} from 'module'; const require=createRequire(import.meta.url); const {chromium}=require('playwright');
import http from 'http'; import fs from 'fs'; import path from 'path';
const dir=process.cwd();
const srv=http.createServer((q,r)=>{const p=path.join(dir,decodeURIComponent(q.url.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.json')?'application/json':'text/html'});r.end(d);});}).listen(8765);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const jobs=JSON.parse(process.argv[2]);
for(const j of jobs){
 const p=await b.newPage({viewport:{width:j.w,height:j.h},deviceScaleFactor:2});
 p.on('console',m=>console.log('console',m.text()));
 await p.goto(`http://localhost:8765/map.html?lng=${j.lng}&lat=${j.lat}&z=${j.z}`);
 await p.waitForFunction('window.done===true',null,{timeout:120000});
 await p.waitForTimeout(500);
 await p.screenshot({path:j.out,type:'jpeg',quality:92});
 console.log('ok',j.out); await p.close();
}
await b.close(); srv.close();
