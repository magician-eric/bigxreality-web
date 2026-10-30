import metadata from '../data/site.json' with { type: 'json' };
/** Single published URL authority. Routes stay /tw/... internally; Pages adds the base once. */
export const publicSiteRoot = metadata.url.replace(/\/+$/, '');
export const publicBasePath = new URL(publicSiteRoot + '/').pathname;
export function publicUrl(path: string | URL): URL {
 const input=String(path),root=new URL(publicSiteRoot+'/');
 if(/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(input))return new URL(input,root);
 if(publicBasePath!=='/'&&input.startsWith(publicBasePath))return new URL(input,root.origin);
 return new URL(input.replace(/^\/+/,''),root);
}
/** Files in an artifact are not physically nested under the Pages mount point. */
export function artifactPath(url:string|URL):string {
 const path=new URL(String(url),publicSiteRoot+'/').pathname;
 if(publicBasePath!=='/'&&path.startsWith(publicBasePath))return '/'+path.slice(publicBasePath.length);
 return path;
}
