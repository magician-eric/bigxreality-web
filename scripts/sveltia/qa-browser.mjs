// Real pinned Sveltia application; all edits live in a browser OPFS clone, never GitHub or src/content.
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
import {parse} from 'yaml';
import {CHROMIUM} from '../lib/serve.mjs';
import {loadSchemas} from './schema.mjs';
const run=promisify(execFile),repo=path.resolve(import.meta.dirname,'../..'),cache=path.join(repo,'.qa/sveltia');
await mkdir(cache,{recursive:true});
const cdn='https://cdn.jsdelivr.net/npm/@sveltia/cms@0.253.1/';
const server=createServer(async(req,res)=>{
 let p=new URL(req.url,'http://localhost').pathname.replace(/^\/bigxreality-web/,'');if(p.endsWith('/'))p+='index.html';
 const file=path.resolve(repo,'public','.'+p);
 if(!file.startsWith(path.join(repo,'public')+path.sep))return res.writeHead(404).end();
 try{res.writeHead(200,{'content-type':({'.html':'text/html','.js':'application/javascript','.yml':'text/yaml'})[path.extname(file)]??'application/octet-stream'}).end(await readFile(file));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(4398,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:CHROMIUM});
const originals={'.git/HEAD':'ref: refs/heads/feature/sveltia-cms\n','src/data/news-media.json':await readFile(path.join(repo,'src/data/news-media.json'),'utf8')};
async function collect(folder){for(const item of await readdir(path.join(repo,folder),{withFileTypes:true})){const file=folder+'/'+item.name;if(item.isDirectory())await collect(file);else if(file.endsWith('.md'))originals[file]=await readFile(path.join(repo,file),'utf8');}}
await collect('src/content');
const imageNames=(await readdir(path.join(repo,'src/assets/images/clients'))).filter(n=>n.endsWith('.png'));
const image=await readFile(path.join(repo,'src/assets/images/clients',imageNames[0]));
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(/config|configuration|not supported|will be ignored/i.test(message.text())&&['warning','error'].includes(message.type()))errors.push(message.text());});
 // Load official application code via its pinned CDN; cache only JS, never external media.
 await page.route('https://**/*',async route=>{
  const url=route.request().url();
  const dependency=url.startsWith('https://unpkg.com/immutable@5.1.9/');
  const font=url.startsWith('https://cdn.jsdelivr.net/fontsource/');
  if(!url.startsWith(cdn)&&!dependency&&!font){await route.abort();return;}
  const downloadURL=dependency?url.replace('https://unpkg.com/','https://cdn.jsdelivr.net/npm/'):url;
  const cached=path.join(cache,Buffer.from(url).toString('base64url'));
  try{
   if(!existsSync(cached)){
    if(url.endsWith('/sveltia-cms.js')&&process.env.SVELTIA_BUNDLE)await writeFile(cached,await readFile(process.env.SVELTIA_BUNDLE));
    else await run('curl',['--fail','--location','--silent','--show-error','--retry','2','--max-time','45',downloadURL,'-o',cached]);
   }
   await route.fulfill({body:await readFile(cached),headers:{'access-control-allow-origin':'*'},contentType:url.endsWith('.woff2')?'font/woff2':url.endsWith('.css')?'text/css':'application/javascript'});
  }catch(error){errors.push(`CMS code download failed: ${url}`);await route.abort();}
 });
 await page.addInitScript(()=>{window.showDirectoryPicker=async()=>(await navigator.storage.getDirectory()).getDirectoryHandle('bxr-isolated-cms-qa',{create:true});});
 const go=async base=>{await page.goto(`http://127.0.0.1:4398${base}admin/`);await page.getByRole('button',{name:'Sign In Using Access Token'}).waitFor({timeout:90000});await page.getByText('Loading CMS Configuration...',{exact:true}).waitFor({state:'hidden'});};
 await go('/');
 // Token entry is available. No real user credential is supplied; live GitHub authorization is NOT passed.
 await page.getByRole('button',{name:'Sign In Using Access Token'}).click();
 await page.getByRole('textbox',{name:'Personal Access Token',exact:true}).waitFor();
 await go('/bigxreality-web/');
 await page.screenshot({path:path.join(cache,'login-desktop.png')});
 await page.evaluate(async(files)=>{
  const root=await(await navigator.storage.getDirectory()).getDirectoryHandle('bxr-isolated-cms-qa',{create:true});
  for(const[file,text]of Object.entries(files)){const parts=file.split('/');let dir=root;for(const part of parts.slice(0,-1))dir=await dir.getDirectoryHandle(part,{create:true});const h=await dir.getFileHandle(parts.at(-1),{create:true});const w=await h.createWritable();await w.write(text);await w.close();}
 },originals);
 await page.getByRole('button',{name:'Work with Local Repository'}).click();
 await page.getByRole('button',{name:'Show Account Menu'}).waitFor();
 const readClone=async()=>page.evaluate(async()=>{
  const root=await(await navigator.storage.getDirectory()).getDirectoryHandle('bxr-isolated-cms-qa');const out={};
  async function walk(dir,prefix=''){for await(const[name,handle]of dir.entries()){const p=prefix+name;if(handle.kind==='directory')await walk(handle,p+'/');else out[p]=Array.from(new Uint8Array(await(await handle.getFile()).arrayBuffer()));}}
  await walk(root);return out;
 });
 const textOf=(clone,file)=>Buffer.from(clone[file]??[]).toString('utf8');
 await page.getByRole('treeitem',{name:'隔離測試文章（不會顯示於官網）',exact:true}).click();
 await page.getByRole('main',{name:/隔離測試文章/}).waitFor();
 await page.getByRole('button',{name:'Create New Entry'}).first().click();
 await page.getByRole('textbox',{name:'標題',exact:true}).fill('bxr-cms-browser-qa');
 await page.getByRole('group',{name:/測試圖片.*Field/}).locator('input[type=file]').first().setInputFiles({name:'bxr-cms-upload.png',mimeType:'image/png',buffer:image});
 await page.getByRole('textbox',{name:'內文',exact:true}).fill('BXR isolated browser test.');
 await page.getByRole('button',{name:'Save',exact:true}).click();
 await page.getByRole('row',{name:/bxr-cms-browser-qa/}).waitFor();
 let clone=await readClone(),saved=textOf(clone,'cms-test-content/bxr-cms-browser-qa.md');
 assert.ok(saved.includes('BXR isolated browser test.'));
 const asset=Object.keys(clone).find(p=>p.startsWith('cms-test-media/')&&p.endsWith('.png'));assert.ok(asset);
 assert.deepEqual(Buffer.from(clone[asset]),image);
 await page.getByRole('row',{name:/bxr-cms-browser-qa/}).click();
 await page.getByRole('textbox',{name:'內文',exact:true}).fill('BXR isolated edit verified.');
 await page.getByRole('button',{name:'Save',exact:true}).click();
 await page.getByRole('row',{name:/bxr-cms-browser-qa/}).waitFor();
 clone=await readClone();assert.ok(textOf(clone,'cms-test-content/bxr-cms-browser-qa.md').includes('BXR isolated edit verified.'));
 // Edit a real multilingual story in the disposable clone. All three sibling paths must survive.
 await page.getByRole('treeitem',{name:'最新消息 · 繁體中文（TW）',exact:true}).click();
 const id='news-01-ds-2025';
 const raw=parse(originals[`src/content/news/tw/${id}.md`].split(/^---\s*$/m)[1]);
 await page.getByRole('row').filter({hasText:raw.title}).first().click();
 // Sveltia lazily mounts off-screen fields; scroll the editor to the Markdown field.
 for(let i=0;i<12&&await page.getByRole('textbox',{name:'完整內文',exact:true}).count()===0;i++){
  await page.getByRole('group',{name:'Content Editor'}).evaluate(root=>root.querySelectorAll('*').forEach(el=>{if(el.scrollHeight>el.clientHeight+100)el.scrollTop=el.scrollHeight;}));
  await page.waitForTimeout(150);
 }
 const body=page.getByRole('textbox',{name:'完整內文',exact:true}).first();await body.fill('BXR local TW test only.');
 const coverGroup=page.getByRole('group',{name:/封面.*Field/}).first();
 await coverGroup.getByRole('checkbox').check();
 await coverGroup.getByRole('button',{name:'Expand',exact:true}).click();
 await coverGroup.locator('input[type=file]').first().setInputFiles({name:'bxr-news-upload.png',mimeType:'image/png',buffer:image});
 await coverGroup.getByRole('textbox',{name:'替代文字',exact:true}).fill('BXR isolated existing logo upload test');
 await page.getByRole('button',{name:'Save',exact:true}).click();
 await page.getByRole('row').filter({hasText:raw.title}).first().waitFor();
 clone=await readClone();const schemas=loadSchemas();
 for(const lang of ['tw','en','jp']){
  const file=`src/content/news/${lang}/${id}.md`,source=textOf(clone,file);
  assert.ok(source,`${lang} file missing`);assert.ok(schemas.news.safeParse(parse(source.split(/^---\s*$/m)[1])).success,`${lang} schema invalid after actual CMS save`);
  if(lang==='tw'){
   assert.ok(source.includes('BXR local TW test only.'));
   const raw=parse(source.split(/^---\s*$/m)[1]);
   assert.ok(raw.cover.src.startsWith('../../../assets/images/news/'));
   const assetPath=path.posix.normalize(path.posix.join('src/content/news/tw',raw.cover.src));
   assert.deepEqual(Buffer.from(clone[assetPath]),image);
  }else assert.equal(source,originals[file],`${lang} translation changed without editing`);
 }
 // Create draft news through each real collection, with one shared slug and no invented date.
 for(const [lang,label] of Object.entries({tw:'繁體中文（TW）',en:'English（EN）',jp:'日本語（JP）'})){
  await page.getByRole('treeitem',{name:`最新消息 · ${label}`,exact:true}).click();
  await page.getByRole('button',{name:'Create New Entry'}).first().click();
  await page.getByRole('textbox',{name:'標題',exact:true}).fill('bxr-cms-draft-qa');
  await page.getByRole('textbox',{name:'摘要',exact:true}).fill(`Isolated ${lang} draft, never published.`);
  for(let i=0;i<12&&await page.getByRole('group',{name:/分類.*Field/}).count()===0;i++){
   await page.getByRole('group',{name:'Content Editor'}).evaluate(root=>root.querySelectorAll('*').forEach(el=>{if(el.scrollHeight>el.clientHeight+100)el.scrollTop=el.scrollHeight;}));
   await page.waitForTimeout(150);
  }
  await page.getByRole('group',{name:/分類.*Field/}).getByRole('combobox').click();
  await page.getByRole('option',{name:'company',exact:true}).click();
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await page.getByRole('row',{name:/bxr-cms-draft-qa/}).waitFor();
  const clone=await readClone(),source=textOf(clone,`src/content/news/${lang}/bxr-cms-draft-qa.md`),raw=parse(source.split(/^---\s*$/m)[1]);
  assert.ok(schemas.news.safeParse(raw).success);assert.equal(raw.draft,true);assert.equal(raw.publishDate,undefined);
  assert.equal(raw.translationStatus,lang==='tw'?'source':'pending');
 }
 await page.getByRole('treeitem',{name:'新聞共用圖集與影片（進階）',exact:true}).click();
 await page.getByRole('row').filter({hasText:'新聞媒體資料'}).first().click();
 const mediaInput=page.getByRole('textbox',{name:'媒體對應表',exact:true});
 const mediaMap=JSON.parse(await mediaInput.inputValue());
 assert.deepEqual(mediaMap,JSON.parse(originals['src/data/news-media.json']));
 await mediaInput.fill('{ invalid');assert.equal(await mediaInput.getAttribute('aria-invalid'),'true');
 mediaMap['bxr-cms-draft-qa']={gallery:[],videos:[],sourceLinks:[]};
 await mediaInput.fill(JSON.stringify(mediaMap,null,2));
 await page.getByRole('button',{name:'Save',exact:true}).click();
 await page.getByRole('row').filter({hasText:'新聞媒體資料'}).first().waitFor();
 clone=await readClone();assert.deepEqual(JSON.parse(textOf(clone,'src/data/news-media.json')),mediaMap);
 await page.screenshot({path:path.join(cache,'news-desktop.png')});
 assert.deepEqual(errors,[]);
 // Sign out before checking the phone viewport; never reload a remembered OPFS handle.
 await page.getByRole('button',{name:'Show Account Menu'}).click();await page.getByRole('menuitem',{name:'Sign Out',exact:true}).click();
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Sign In Using Access Token'}).waitFor();
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:path.join(cache,'login-mobile.png')});
 console.log('PASS: real pinned CMS config loads at /admin/ and Pages subpath; token form; local-clone create/edit/image-byte upload; existing article save plus three new draft news siblings, correct optional fields, unchanged translations and lossless media JSON save; mobile login. Live GitHub auth/write not tested.');
}finally{await browser.close();server.close();}
