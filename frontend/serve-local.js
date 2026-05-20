const http=require('http');
const fs=require('fs');
const path=require('path');
const root=process.cwd();
http.createServer((req,res)=>{
 let p=req.url.split('?')[0]; if(p==='/' ) p='/index.html';
 const fp=path.join(root, decodeURIComponent(p));
 fs.readFile(fp,(e,d)=>{ if(e){res.statusCode=404; return res.end('Not found');}
 const ext=path.extname(fp).toLowerCase();
 const m={'.html':'text/html; charset=UTF-8','.js':'text/javascript; charset=UTF-8','.css':'text/css; charset=UTF-8','.json':'application/json; charset=UTF-8'}[ext]||'text/plain; charset=UTF-8';
 res.setHeader('Content-Type',m); res.end(d);
 });
}).listen(8080,'127.0.0.1');
