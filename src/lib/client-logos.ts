import type { ImageMetadata } from 'astro';
import config from '../data/client-logos.json';
import type { Lang } from '../i18n';
const images = import.meta.glob<{ default: ImageMetadata }>('../assets/images/clients/*.png', { eager: true });
/** Unconfigured uploads stay hidden until explicitly reviewed in the single shared config. */
export function clientLogos(lang: Lang) {
  return config.filter(item => item.enabled).flatMap(item => {
    const image = images[`../assets/images/clients/${item.file}`]?.default;
    if (!image) throw new Error(`Client logo missing: ${item.file}`);
    return [{ image, alt: item.alt[lang], file: item.file }];
  });
}
export const clientLogoCopy = {
  tw: { title: '客戶與合作單位', description: '全球動力科技持續與台灣政府機關及各領域專業單位合作，推動模擬訓練與數位科技的實務應用。', pause: '暫停 Logo 捲動', play: '繼續 Logo 捲動' },
  en: { title: 'Clients & Collaborating Organizations', description: 'Big x Reality works with government agencies in Taiwan and specialist organizations across sectors to advance practical applications of simulation training and digital technologies.', pause: 'Pause logo scrolling', play: 'Resume logo scrolling' },
  jp: { title: '導入先・協力機関', description: 'Big x Realityは、台湾の政府機関や各分野の専門機関と連携し、シミュレーション訓練とデジタル技術の実践的な活用を推進しています。', pause: 'ロゴのスクロールを停止', play: 'ロゴのスクロールを再開' },
};
