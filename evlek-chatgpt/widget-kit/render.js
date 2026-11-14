const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:430,height:932},deviceScaleFactor:2});
const W=fs.readFileSync(process.argv[2],'utf8');const R=JSON.parse(fs.readFileSync('result.json','utf8'));
await p.addInitScript(([w,r])=>{window.__WIDGET__=w;window.__RESULT__=r;},[W,R]);
p.on('console',m=>console.log('console',m.text().slice(0,200)));
await p.goto('file://'+process.cwd()+'/'+(process.argv[4]||'host.html')+'');await p.waitForTimeout(6000);
await p.screenshot({path:process.argv[3],fullPage:true});await b.close();})();
