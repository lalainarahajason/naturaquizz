// serverTranslations.ts
import { general, form, authentication } from '@/translations/strings';

const translationSets: Record<TranslationSet, Translations> = {
  general,
  form,
  authentication
};

export function serverTranslate(key: string, lang: Lang ='en', set: TranslationSet = 'general'): string {
  return translationSets[set][lang][key] || key;
}