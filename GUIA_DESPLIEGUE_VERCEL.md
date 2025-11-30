# 🚀 Guía de Despliegue en Vercel - Techland

## 📋 Pre-requisitos

1. ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
2. ✅ Proyecto en GitHub/GitLab/Bitbucket
3. ✅ MongoDB Atlas configurado
4. ✅ Cloudinary configurado
5. ✅ Google OAuth configurado (opcional)

---

## 🔧 Paso 1: Preparar el Proyecto

### 1.1 Verificar que el proyecto compile

```bash
npm run build
```

Si hay errores, corrígelos antes de continuar.

### 1.2 Verificar .gitignore

Asegúrate de que `.gitignore` incluya:
```
.env
.env.local
.env*.local
node_modules
.next
.vercel
```

---

## 🌐 Paso 2: Subir a GitHub (si no está)

```bash
# Si no tienes git inicializado
git init
git add .
git commit -m "Initial commit - Ready for Vercel"

# Crear repositorio en GitHub y luego:
git remote add origin https://github.com/TU_USUARIO/techland.git
git branch -M main
git push -u origin main
```

---

## 📦 Paso 3: Desplegar en Vercel

### Opción A: Desde la Web (Recomendado)

1. **Ir a [vercel.com](https://vercel.com)**
2. **Iniciar sesión** con GitHub
3. **Click en "Add New Project"**
4. **Importar tu repositorio** `techland`
5. **Configurar el proyecto:**
   - Framework Preset: **Next.js** (detectado automáticamente)
   - Root Directory: `./` (raíz)
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)
   - Install Command: `npm install` (automático)

6. **Configurar Variables de Entorno:**
   
   Click en "Environment Variables" y agrega:

   ```
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/techland?retryWrites=true&w=majority
   
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   
   GOOGLE_CLIENT_ID=tu_google_client_id
   GOOGLE_CLIENT_SECRET=tu_google_client_secret
   
   AUTH_SECRET=tu_secret_random_generado
   NEXTAUTH_URL=https://tu-dominio.vercel.app
   ```

   **⚠️ IMPORTANTE:**
   - `AUTH_SECRET`: Genera uno con `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Cambia después del primer deploy (será algo como `https://techland-xxx.vercel.app`)

7. **Click en "Deploy"** 🚀

### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Seguir las instrucciones interactivas
```

---

## ✅ Paso 4: Verificar el Despliegue

1. **Esperar 2-3 minutos** mientras Vercel construye
2. **Verificar la URL** que te da Vercel (ej: `techland-abc123.vercel.app`)
3. **Probar la aplicación:**
   - ✅ Home carga
   - ✅ Login funciona
   - ✅ Dashboard funciona
   - ✅ Productos se cargan
   - ✅ Imágenes se suben a Cloudinary

---

## 🔄 Paso 5: Actualizar Variables de Entorno

Después del primer deploy, actualiza:

```
NEXTAUTH_URL=https://tu-url-real.vercel.app
```

Y vuelve a desplegar.

---

## 🎯 Paso 6: Dominio Personalizado (Opcional)

1. En Vercel Dashboard → Settings → Domains
2. Agregar tu dominio
3. Seguir las instrucciones de DNS
4. Esperar propagación (5-30 minutos)

---

## 🐛 Troubleshooting

### Error: "MongoDB connection failed"
- ✅ Verifica `MONGODB_URI` en Vercel
- ✅ Verifica que MongoDB Atlas permita conexiones desde cualquier IP (0.0.0.0/0)

### Error: "Cloudinary upload failed"
- ✅ Verifica las 3 variables de Cloudinary
- ✅ Verifica que la API key tenga permisos de upload

### Error: "Build failed"
- ✅ Revisa los logs en Vercel
- ✅ Prueba `npm run build` localmente
- ✅ Verifica que todas las dependencias estén en `package.json`

### Error: "NextAuth not working"
- ✅ Verifica `AUTH_SECRET`
- ✅ Verifica `NEXTAUTH_URL` (debe ser la URL de Vercel)
- ✅ Verifica `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`

---

## 📝 Checklist Pre-Deploy

- [ ] `npm run build` funciona sin errores
- [ ] Todas las variables de entorno listas
- [ ] MongoDB Atlas configurado y accesible
- [ ] Cloudinary configurado
- [ ] Google OAuth configurado (si usas)
- [ ] Código subido a GitHub
- [ ] `.env` NO está en el repositorio

---

## 🎉 ¡Listo!

Tu aplicación estará en producción en **2-3 minutos**.

**URL de ejemplo:** `https://techland-abc123.vercel.app`

---

## 📚 Recursos

- [Documentación Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variables de Entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

