/** Parses only the supplied local TXT. This module performs no network requests. */
export function parseHistoricalNews(text) {
  const records=[];
  for(const block of text.replaceAll('\r\n','\n').split(/^={16,}\s*$/m)) {
    const id=block.match(/^ARTICLE_ID: (.+)$/m)?.[1];
    if(!id||!/^\[TW\]$/m.test(block))continue;
    const field=name=>block.match(new RegExp('^'+name+': (.+)$','m'))?.[1];
    const languages={};
    for(const [lang,label,titlePrefix,bodyPrefix]of [['tw','TW','標題：','內文：'],['en','EN','Title: ','Body:'],['jp','JP','タイトル：','本文：']]) {
      const section=block.split('['+label+']\n')[1]?.split(/\n\[(?:TW|EN|JP)\]\n/)[0]?.trim();
      if(!section?.startsWith(titlePrefix))throw Error(id+' missing '+lang);
      const line=section.indexOf('\n');
      const title=section.slice(titlePrefix.length,line),body=section.slice(line+1).replace(new RegExp('^'+bodyPrefix+'\\n'),'').trim();
      languages[lang]={title,body,summary:body.split('\n\n')[0]};
    }
    const rawDate=field('DATE');
    records.push({id,date:/^\d{4}-\d{2}-\d{2}$/.test(rawDate)?rawDate:null,dateNote:/^\d{4}-\d{2}-\d{2}$/.test(rawDate)?undefined:rawDate,category:field('CATEGORY').includes('Event')?'event':'media',sourceCategory:field('CATEGORY'),imageSource:field('IMAGE_SOURCE')?.startsWith('https://')?field('IMAGE_SOURCE'):null,note:field('NOTE'),languages});
  }
  if(records.length!==13)throw Error('Expected 13 independent articles, got '+records.length);
  return records;
}
