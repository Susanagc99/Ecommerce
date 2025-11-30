# Guía Simple de i18n (Internacionalización) - TechLand

## ¿Qué es i18n?

**i18n** es la internacionalización - permite que tu app soporte múltiples idiomas de forma sencilla. Los números (18) representan las 18 letras entre la 'i' y la 'n'.

## Estructura del Proyecto

```
src/
├── i18n/
│   ├── en.json          # Traducciones en inglés
│   ├── es.json          # Traducciones en español
│   └── index.ts         # Archivo de configuración
├── context/
│   └── LanguageContext.tsx  # Contexto global del idioma
├── components/
│   └── LanguageSwitcher.tsx # Selector de idioma
└── app/
    ├── providers.tsx    # Proveedores de la aplicación
    └── layout.tsx       # Layout principal
```

## Archivos Implementados

### 1. `src/i18n/es.json` (Español)
Contiene todas las traducciones en español organizadas por secciones:
- `navbar`: Navegación
- `hero`: Sección principal
- `shop`: Tienda
- `cart`: Carrito
- `product`: Productos
- `login`: Inicio de sesión
- `register`: Registro
- `dashboard`: Panel de control
- `about`: Acerca de
- `common`: Textos comunes

### 2. `src/i18n/en.json` (Inglés)
Contiene las mismas secciones pero en inglés.

### 3. `src/i18n/index.ts`
Archivo de configuración que:
- Define el tipo `Language` ('en' | 'es')
- Importa las traducciones
- Exporta la función `getTranslation()`
- Exporta el array `languages` con los idiomas disponibles

### 4. `src/context/LanguageContext.tsx`
Contexto de React que:
- Mantiene el idioma actual
- Guarda la preferencia en `localStorage`
- Provee la función `t()` para obtener traducciones
- Exporta el hook `useLanguage()`

### 5. `src/components/LanguageSwitcher.tsx`
Componente selector de idioma que muestra un dropdown para cambiar entre idiomas.

### 6. `src/app/providers.tsx`
Actualizado para incluir el `LanguageProvider` que envuelve toda la aplicación.

## Cómo Usar las Traducciones

### Paso 1: Importar el hook en tu componente

```typescript
'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function MiComponente() {
  const { t } = useLanguage();  // Obtener función de traducción

  return (
    <div>
      <h1>{t('navbar.home')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button>{t('shop.addToCart')}</button>
    </div>
  );
}
```

### Paso 2: Usar la función `t()` con notación de punto

La función `t()` acepta una cadena con notación de punto para acceder a traducciones anidadas:

```typescript
// Acceder a navbar.home
t('navbar.home')  // → "Inicio" (es) o "Home" (en)

// Acceder a login.errors.emailRequired
t('login.errors.emailRequired')  // → "El email es requerido" (es) o "Email is required" (en)

// Acceder a shop.addToCart
t('shop.addToCart')  // → "Agregar al Carrito" (es) o "Add to Cart" (en)
```

### Paso 3: Agregar el LanguageSwitcher donde lo necesites

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function MiPagina() {
  return (
    <div>
      <LanguageSwitcher />
      {/* El resto de tu contenido */}
    </div>
  );
}
```

## Ejemplo Completo: Página de Login con Traducciones

```typescript
'use client';

import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useState } from 'react';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    if (!email) {
      setErrors(prev => ({ ...prev, email: true }));
      return;
    }
    
    // ... resto de la lógica
  };

  return (
    <div>
      <LanguageSwitcher />
      
      <h1>{t('login.title')}</h1>
      <p>{t('login.subtitle')}</p>
      
      <form onSubmit={handleSubmit}>
        <label>{t('login.email')}</label>
        <input 
          type="email"
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p>{t('login.errors.emailRequired')}</p>}
        
        <label>{t('login.password')}</label>
        <input 
          type="password"
          placeholder={t('login.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p>{t('login.errors.passwordRequired')}</p>}
        
        <button type="submit">
          {t('login.submitButton')}
        </button>
      </form>
      
      <a href="/register">{t('login.registerLink')}</a>
    </div>
  );
}
```

## Cómo Agregar Nuevas Traducciones

### Opción 1: Agregar a una sección existente

En `src/i18n/es.json`:
```json
{
  "navbar": {
    "home": "Inicio",
    "shop": "Tienda",
    "newItem": "Nuevo Item"  // ← Agregar aquí
  }
}
```

En `src/i18n/en.json`:
```json
{
  "navbar": {
    "home": "Home",
    "shop": "Shop",
    "newItem": "New Item"  // ← Agregar aquí
  }
}
```

Usar en tu componente:
```typescript
<span>{t('navbar.newItem')}</span>
```

### Opción 2: Crear una nueva sección

En `src/i18n/es.json`:
```json
{
  "navbar": { ... },
  "checkout": {
    "title": "Finalizar Compra",
    "payment": "Método de Pago",
    "confirm": "Confirmar Pedido"
  }
}
```

En `src/i18n/en.json`:
```json
{
  "navbar": { ... },
  "checkout": {
    "title": "Checkout",
    "payment": "Payment Method",
    "confirm": "Confirm Order"
  }
}
```

Usar en tu componente:
```typescript
<h1>{t('checkout.title')}</h1>
<label>{t('checkout.payment')}</label>
<button>{t('checkout.confirm')}</button>
```

## Ejemplo: Agregar un Nuevo Idioma (Francés)

### 1. Crear `src/i18n/fr.json`:
```json
{
  "navbar": {
    "home": "Accueil",
    "shop": "Boutique",
    "about": "À propos",
    "cart": "Panier",
    "dashboard": "Tableau de bord",
    "login": "Connexion",
    "logout": "Déconnexion"
  },
  "hero": {
    "title": "Bienvenue à TechLand",
    "subtitle": "Découvrez les meilleurs produits technologiques",
    "shopNow": "Acheter Maintenant"
  }
  // ... más traducciones
}
```

### 2. Actualizar `src/i18n/index.ts`:
```typescript
import en from './en.json';
import es from './es.json';
import fr from './fr.json';  // ← Importar

export type Language = 'en' | 'es' | 'fr';  // ← Agregar 'fr'

const translations = {
  en,
  es,
  fr,  // ← Agregar
};

export const getTranslation = (lang: Language) => {
  return translations[lang] || translations.es;
};

export const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },  // ← Agregar
];
```

## Estado Actual de la Implementación

✅ **Completado:**
- Estructura de i18n configurada
- Traducciones en español e inglés
- Contexto de idioma implementado
- Selector de idioma creado
- Navbar actualizado con traducciones
- Integración con providers

📝 **Pendiente de actualizar (opcional):**
- Páginas de login y register
- Página de shop
- Página de cart
- Página de about
- Componentes individuales (ProductCard, HeroSection, etc.)

## Ventajas de esta Implementación

✅ **Simple**: Solo JSON + un contexto React  
✅ **Flexible**: Fácil agregar nuevos idiomas  
✅ **Persistente**: Guarda preferencia del usuario en localStorage  
✅ **Escalable**: Soporta traducciones anidadas  
✅ **Type-safe**: TypeScript para Language type  
✅ **Sin dependencias externas**: No requiere librerías adicionales  

## Tips y Mejores Prácticas

1. **Organización**: Mantén las traducciones organizadas por secciones lógicas
2. **Consistencia**: Usa la misma estructura en todos los archivos de idioma
3. **Claves descriptivas**: Usa nombres de claves claros y descriptivos
4. **Anidación**: Aprovecha la anidación para agrupar traducciones relacionadas
5. **Fallback**: El sistema tiene fallback automático a español si falta una traducción

## Próximos Pasos Recomendados

1. Actualizar las páginas principales (login, register, shop, cart) con traducciones
2. Actualizar los componentes (ProductCard, HeroSection, etc.)
3. Agregar más idiomas si es necesario
4. Considerar agregar traducción automática del navegador
5. Implementar traducciones dinámicas desde el backend (futuro)

## Soporte

Si tienes preguntas o necesitas ayuda, revisa esta guía o consulta los archivos de ejemplo en la carpeta `src/i18n/`.

