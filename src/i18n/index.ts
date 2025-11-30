import en from './en.json';
import es from './es.json';
import productDescriptions from './product-descriptions.json';

export type Language = 'en' | 'es';

const translations = {
  en,
  es,
};

export const getTranslation = (lang: Language) => {
  return translations[lang] || translations.es;
};

// Obtener descripción de producto traducida
export const getProductDescription = (productName: string, lang: Language): string | null => {
  const descriptions = productDescriptions[lang] as Record<string, string>;
  return descriptions[productName] || null;
};

export const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];

