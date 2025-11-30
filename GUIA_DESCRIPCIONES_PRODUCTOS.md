# Guía: Traducciones de Descripciones de Productos

## 📝 Solución Temporal Implementada

Se ha creado un sistema de traducciones manuales para las descripciones de productos usando un archivo JSON.

## 📁 Archivo de Traducciones

**Ubicación:** `src/i18n/product-descriptions.json`

### Estructura:

```json
{
  "en": {
    "Nombre del Producto": "Product description in English..."
  },
  "es": {
    "Nombre del Producto": "Descripción del producto en español..."
  }
}
```

## ✏️ Cómo Agregar una Nueva Traducción

### Paso 1: Identificar el nombre exacto del producto

El nombre debe coincidir **exactamente** con el nombre en la base de datos.

### Paso 2: Agregar la traducción

Abre `src/i18n/product-descriptions.json` y agrega:

```json
{
  "en": {
    "PlayStation 5 Console": "Next-gen gaming console...",
    "Mi Nuevo Producto": "Description in English here"  // ← Agregar aquí
  },
  "es": {
    "PlayStation 5 Console": "Consola de juegos...",
    "Mi Nuevo Producto": "Descripción en español aquí"  // ← Agregar aquí
  }
}
```

### Paso 3: ¡Listo!

El sistema automáticamente:
1. Busca la traducción según el idioma actual
2. Si la encuentra, la muestra
3. Si no, muestra la descripción original de la BD

## 🔄 Cómo Funciona

```typescript
// Cuando el usuario cambia de idioma:

Español seleccionado:
  - Busca en product-descriptions.json["es"]["Nombre del Producto"]
  - Si existe → Muestra traducción en español
  - Si no existe → Muestra descripción original de BD

English seleccionado:
  - Busca en product-descriptions.json["en"]["Nombre del Producto"]
  - Si existe → Muestra traducción en inglés
  - Si no existe → Muestra descripción original de BD
```

## 📋 Ejemplo Completo

### Producto en la Base de Datos:
```javascript
{
  name: "Teclado RGB Gamer",
  description: "Teclado mecánico con luces RGB personalizables..."
}
```

### Agregar Traducción:

En `product-descriptions.json`:

```json
{
  "en": {
    "Teclado RGB Gamer": "Gaming RGB mechanical keyboard with customizable lighting, anti-ghosting, and premium switches for the ultimate gaming experience."
  },
  "es": {
    "Teclado RGB Gamer": "Teclado mecánico gaming con iluminación RGB personalizable, anti-ghosting y switches premium para la mejor experiencia de juego."
  }
}
```

### Resultado:
- Usuario en español: Ve la descripción en español
- Usuario en inglés: Ve la descripción traducida al inglés

## 🎯 Productos con Traducciones Incluidas

Ya incluí traducciones para **27 productos** completos:
- Portable Retro Mini Console
- Smarphone Gamepad Controller
- JBL Flip 6 Bluetooth Speaker
- Victorinox Swiss Army Knife USB
- XGIMI Horizon Pro Projector
- Anki Cozmo Educational Robot
- DJI Mini 3 Pro Drone
- USB Desktop Vacuum Cleaner
- Xbox Elite Wireless Controller
- Meta Quest 3 VR Headset
- Anker PowerLine III USB-C Cable
- Logitech MX Master 3S
- Secretlab TITAN Gaming Chair
- Amazon Echo Dot (5th Gen)
- HyperX Cloud II Gaming Headset
- Samsung Odyssey G7 Gaming Monitor
- Elago MS3 Phone Stand
- Sony WF-1000XM5 Earbuds
- Spigen Tempered Glass Screen Protector
- Keychron K8 Mechanical Keyboard
- Anker PowerCore 20000mAh
- Rain Design mStand Laptop Stand
- Apple Watch Series 9
- Fitbit Charge 6
- Blue Yeti USB Microphone
- PlayStation 5 Console
- Anker 7-Port USB Hub

## ⚠️ Importante

1. **Nombre exacto**: El nombre en el JSON debe coincidir **exactamente** con el de la BD
2. **Sensible a mayúsculas**: "PlayStation 5" ≠ "playstation 5"
3. **Fallback**: Si no hay traducción, se muestra la descripción original

## 🚀 Próximos Pasos (Futuro)

Para cuando quieras automatizar:

### Opción 1: Google Translate API
```typescript
// Traducción automática al crear producto
const translateText = async (text: string, targetLang: string) => {
  const response = await fetch('https://translation.googleapis.com/...');
  return response.translation;
}
```

### Opción 2: ChatGPT API
```typescript
// Traducción con mejor contexto
const translateProduct = async (description: string) => {
  const prompt = `Translate this tech product description to English: ${description}`;
  // Llamar a OpenAI API
}
```

### Opción 3: Campos separados en BD
```javascript
// Modelo de producto actualizado
{
  name_es: "Teclado RGB",
  name_en: "RGB Keyboard",
  description_es: "...",
  description_en: "..."
}
```

## 💡 Tips

1. **Consistencia**: Mantén el mismo tono en ambos idiomas
2. **SEO**: Usa palabras clave relevantes en cada idioma
3. **Longitud**: Trata de mantener longitudes similares
4. **Actualización**: Cuando actualizas una descripción en la BD, actualiza el JSON

## 📝 Plantilla para Nuevas Traducciones

```json
{
  "en": {
    "Nombre Exacto del Producto": "English description here. Focus on features and benefits."
  },
  "es": {
    "Nombre Exacto del Producto": "Descripción en español aquí. Enfócate en características y beneficios."
  }
}
```

---

## ✅ Ventajas de esta Solución Temporal

- ✅ No requiere modificar la base de datos
- ✅ No requiere APIs de pago
- ✅ Control total sobre las traducciones
- ✅ Fácil de mantener
- ✅ Se puede migrar fácilmente a una solución automática después

## ⏭️ Migración Futura

Cuando decidas automatizar, este archivo sirve como referencia de calidad para entrenar o validar las traducciones automáticas.

