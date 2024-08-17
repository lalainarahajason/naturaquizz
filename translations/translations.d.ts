
declare global {

  type Lang = "en" | "fr";

  type TranslationKeys = {
    [key: string]: string;
  };
  
  type Translations = {
      [key in 'en' | 'fr']: TranslationKeys;
  };

  //  TODO : merge register with authentication
  type TranslationSet = 'general' | 'form' | 'authentication';

  type translationContextType = {
    lang: Lang;
    setLang: (lang: Lang) => void;
    translate: (key: string, set: TranslationSet) => string;
  }

 

  type translationProvider = {
    children: React.ReactNode
  }

}

export {};
