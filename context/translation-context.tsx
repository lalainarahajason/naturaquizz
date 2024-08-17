"use client";

import React, { useContext, useState, createContext } from "react";
import { 
    general, 
    form, 
    authentication 
} from "@/translations/strings";

const translationSets: Record<TranslationSet, Translations> = {
  general,
  form,
  authentication
};


const TranslationContext = createContext<translationContextType|undefined>(undefined);

export const TranslationProvider = ({ children }: translationProvider) => {

    const [lang, setLang] = useState<Lang>("fr");

    const translate = (key: string, set:TranslationSet="general"): string => {
        return translationSets[set][lang][key] || key;
    };

    const value = { lang, setLang, translate }

    return (
        <TranslationContext.Provider value={ value }>
            {children}
        </TranslationContext.Provider>
    )
}

export const useTranslation = () => {
    
    const context = useContext(TranslationContext);

    if(!context) {
        throw new Error('useTranslation must be used within a TranslationProvider')
    }
    
    return context;
}