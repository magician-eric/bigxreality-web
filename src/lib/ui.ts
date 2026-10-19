import tw from "../content/ui/tw.json";
import en from "../content/ui/en.json";
import jp from "../content/ui/jp.json";
import type { Lang } from "../i18n";

export type Ui = typeof tw;
const strings: Record<Lang, Ui> = { tw, en, jp };

export function getUi(lang: Lang): Ui {
  return strings[lang];
}

/** Replaces `{name}` placeholders. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
