// Gerçek Evlek widget'ını ChatGPT benzeri bir ev sahibinde (gerçek origin, koyu tema) çalıştırır.
// openWidget(page, {widget, result, mode, widthPt}) → iframe Frame döner.
import http from 'http';
import fs from 'fs';
import path from 'path';
const VARS = {'--color-background-primary': '#212121', '--color-background-secondary': '#171717', '--color-background-inverse': '#ECECEC', '--color-text-primary': '#F9F9F9', '--color-text-secondary': '#CDCDCD', '--color-text-tertiary': '#9B9B9B', '--color-text-inverse': '#0D0D0D', '--color-border-primary': '#4A4A4A', '--color-border-tertiary': '#353535'};
const FONTCSS = `<style>${['400','500','600','700'].map(w=>`@font-face{font-family:'InterV';font-weight:${w};src:url(/fonts/inter-latin-${w}-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:'InterV';font-weight:${w};src:url(/fonts/inter-latin-ext-${w}-normal.woff2) format('woff2');unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}`).join('')}html,body,button,input,select,textarea{font-family:'InterV',-apple-system,sans-serif!important}</style>`;
let server, port;
const store = {};
export async function startServer() {
  if (server) return port;
  server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/host.html') { res.writeHead(200, {'content-type': 'text/html; charset=utf-8'}); res.end(store.host); return; }
    if (u.pathname.startsWith('/fonts/')) { const f = path.resolve('../public' + u.pathname); if (fs.existsSync(f)) { res.writeHead(200, {'content-type': 'font/woff2', 'access-control-allow-origin': '*'}); res.end(fs.readFileSync(f)); return; } }
    if (u.pathname.startsWith('/w/')) { const k = u.pathname.slice(3); res.writeHead(200, {'content-type': 'text/html; charset=utf-8'}); res.end(store[k]); return; }
    res.writeHead(404); res.end();
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  port = server.address().port;
  return port;
}
export function stopServer() { server?.close(); server = null; }

const shim = (R, mode) => `<script>(function(){var R=${JSON.stringify(R)};window.openai={theme:'dark',displayMode:'${mode}',locale:'tr-TR',maxHeight:4000,safeArea:{insets:{top:0,bottom:0,left:0,right:0}},userAgent:{device:{type:'mobile'},capabilities:{hover:false,touch:true}},toolInput:{},toolOutput:R.structuredContent,toolResponseMetadata:R._meta||null,widgetState:null,
requestDisplayMode:function(o){parent.postMessage({__evlekHost:'displayMode',mode:o&&o.mode},'*');return Promise.resolve({mode:o&&o.mode});},
openExternal:function(o){parent.postMessage({__evlekHost:'open',href:o&&o.href},'*');},
setWidgetState:function(s){window.openai.widgetState=s;return Promise.resolve();},
callTool:function(){return Promise.resolve({});},sendFollowUpMessage:function(){return Promise.resolve();},notifyIntrinsicHeight:function(){}};})();<\/script>`;

export async function openWidget(page, {widget, result, mode = 'inline', key = 'a'}) {
  await startServer();
  const R = JSON.parse(fs.readFileSync(result, 'utf8'));
  const W = fs.readFileSync(widget, 'utf8');
  store[key] = W.replace(/<head[^>]*>/i, (m) => m + shim(R, mode) + FONTCSS);
  store.host = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#212121;color-scheme:dark}iframe{border:0;width:100%;height:900px;display:block;color-scheme:dark}</style></head><body><iframe id="f" src="/w/${key}"></iframe><script>
const R=${JSON.stringify(R)},MODE='${mode}',VARS=${JSON.stringify(VARS)};const f=document.getElementById('f');window.__events=[];
addEventListener('message',e=>{const m=e.data;if(m&&m.__evlekHost){__events.push(m);return;}if(!m||m.jsonrpc!=='2.0')return;
if(m.method==='ui/initialize'&&m.id){f.contentWindow.postMessage({jsonrpc:'2.0',id:m.id,result:{protocolVersion:'2026-01-26',hostInfo:{name:'chatgpt',version:'1'},hostCapabilities:{openLinks:{}},hostContext:{styles:{variables:VARS},theme:'dark',displayMode:MODE,locale:'tr-TR',availableDisplayModes:['inline','fullscreen'],safeAreaInsets:{top:0,bottom:0,left:0,right:0}}}},'*');setTimeout(()=>f.contentWindow.postMessage({jsonrpc:'2.0',method:'ui/notifications/tool-result',params:R},'*'),50);}
else if(m.method==='ui/notifications/size-changed'){f.style.height=(m.params.height||900)+'px';}
else if(m.id){__events.push({req:m.method});f.contentWindow.postMessage({jsonrpc:'2.0',id:m.id,result:{}},'*');}});
</script></body></html>`;
  await page.goto(`http://127.0.0.1:${port}/host.html`);
  await page.waitForFunction(() => document.getElementById('f').contentDocument?.readyState === 'complete');
  return page.frames().find((fr) => fr.url().includes('/w/'));
}
