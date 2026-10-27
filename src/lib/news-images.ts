import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import records from '../data/news-images.json';
interface NewsImage { filename: string; approved: boolean; alt?: Record<Lang,string> }
// Astro resolves local imports to deployment-safe asset URLs; an empty folder is valid.
const assets=import.meta.glob<{default:ImageMetadata}>('../assets/images/news/*.{jpg,jpeg,png}',{eager:true});
export function newsCover(id: string | undefined, lang: Lang) {
  const record=id?(records as Record<string,NewsImage>)[id]:undefined;
  if(!record?.approved||!record.alt?.[lang])return undefined;
  const image=assets['../assets/images/news/'+record.filename]?.default;
  return image?{src:image,alt:record.alt[lang]}:undefined;
}
