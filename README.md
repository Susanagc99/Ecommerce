# 🛒 Techland - E-commerce de Tecnología

E-commerce moderno y completo para la venta de gadgets tecnológicos, desarrollado con Next.js 16, TypeScript y MongoDB. Incluye sistema de autenticación, carrito de compras, panel administrativo, internacionalización y más.

## Enlaces

- **Demo en Vercel:** https://techland-one.vercel.app/

---

## Características Implementadas

### E-commerce Core
- ✅ Catálogo de productos con búsqueda y filtros por categoría
- ✅ Carrito de compras con persistencia local
- ✅ Vista de detalles de productos con modal
- ✅ Productos destacados en home
- ✅ Paginación de productos
- ✅ Diseño responsive (mobile, tablet, desktop)

### Autenticación y Usuarios
- ✅ Sistema de registro y login
- ✅ Autenticación con Google (NextAuth.js)
- ✅ Roles de usuario (Admin / Customer)
- ✅ Protección de rutas según rol
- ✅ Gestión de sesiones con Context API

### Panel Administrativo
- ✅ Dashboard para administradores
- ✅ CRUD completo de productos (Crear, Leer, Actualizar, Eliminar)
- ✅ Subida de imágenes a Cloudinary
- ✅ Gestión de stock y productos destacados
- ✅ Validaciones en frontend y backend

### Internacionalización (i18n)
- ✅ Soporte para Español e Inglés
- ✅ Cambio de idioma en tiempo real
- ✅ Traducción de toda la interfaz
- ✅ Descripciones de productos traducidas
- ✅ Persistencia de idioma preferido

### Sistema de Emails
- ✅ Email de bienvenida al registrarse
- ✅ Templates HTML personalizados
- ✅ Integración con Nodemailer (Gmail)

### Validaciones y Seguridad
- ✅ Validaciones en frontend (validaciones manuales)
- ✅ Validaciones en backend con Yup
- ✅ Schemas de validación para productos y autenticación
- ✅ Manejo de errores consistente

### UI/UX
- ✅ Diseño moderno con gradientes y animaciones
- ✅ Componentes reutilizables (Button, Input, ProductCard, etc.)
- ✅ Notificaciones toast (React Toastify)
- ✅ Alertas personalizadas (SweetAlert2)
- ✅ Menú hamburguesa responsive
- ✅ Tipografía moderna (Space Grotesk)

---

## Tecnologías Utilizadas

### Frontend
- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **CSS Modules** - Estilos modulares
- **Heroicons** - Iconos

### Backend
- **Next.js API Routes** - Endpoints del servidor
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **NextAuth.js** - Autenticación
- **Nodemailer** - Envío de emails

### Servicios Externos
- **Cloudinary** - Almacenamiento de imágenes
- **Vercel** - Hosting y despliegue

### Validación y Utilidades
- **Yup** - Validación de esquemas
- **Axios** - Cliente HTTP
- **React Toastify** - Notificaciones
- **SweetAlert2** - Alertas personalizadas

---

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- MongoDB Atlas (o MongoDB local)
- Cuenta de Cloudinary
- Cuenta de Gmail (para emails)

### Pasos para clonar y ejecutar

1. **Clonar el repositorio**
```bash
git clone https://github.com/Susanagc99/Techland.git
cd techland
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Base de datos
MONGODB_URI=tu-mongodb-connection-string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key-generada

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# Email (Nodemailer)
MAIL_USER=tu-email@gmail.com
MAIL_PASS=tu-app-password-gmail

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

---

## Estructura del Proyecto

```
techland/
├── src/
│   ├── app/                 # Rutas y páginas (App Router)
│   │   ├── api/            # API Routes
│   │   ├── dashboard/      # Panel administrativo
│   │   ├── shop/           # Tienda
│   │   ├── cart/           # Carrito
│   │   └── ...
│   ├── components/         # Componentes reutilizables
│   ├── context/            # Context API (Auth, Cart, Language)
│   ├── database/           # Modelos de MongoDB
│   ├── i18n/               # Traducciones (es.json, en.json)
│   ├── lib/                # Utilidades y servicios
│   │   ├── email.ts        # Servicio de emails
│   │   ├── emailTemplates/ # Templates HTML
│   │   ├── authSchemas.ts  # Validaciones auth
│   │   └── productSchemas.ts # Validaciones productos
│   └── styles/             # CSS Modules
└── public/                 # Archivos estáticos
```

---

## Credenciales de Prueba

### Usuario Admin
- **Username:** susana
- **Password:** admin123

### Usuario Customer
- Puedes registrarte desde `/register`

---

## Funcionalidades por Rol

### Customer (Cliente)
- Navegar por la tienda
- Buscar y filtrar productos
- Ver detalles de productos
- Agregar productos al carrito
- Cambiar idioma (ES/EN)
- Registrarse e iniciar sesión

### Admin (Administrador)
- Acceso exclusivo al dashboard
- Crear, editar y eliminar productos
- Subir imágenes de productos
- Gestionar stock y productos destacados
- Ver todos los productos en tabla

---

## Internacionalización

El proyecto soporta **Español** e **Inglés**. El idioma se puede cambiar desde el selector en el navbar y se persiste en localStorage.

- Todas las páginas están traducidas
- Descripciones de productos traducidas manualmente
- Categorías y mensajes del sistema traducidos

---

## Sistema de Emails

Al registrarse, los usuarios reciben un email de bienvenida con:
- Template HTML personalizado
- Diseño responsive
- Links a la tienda
- Branding de Techland

**Configuración requerida:**
- Gmail con App Password habilitado
- Variables `MAIL_USER` y `MAIL_PASS` en `.env.local`

---

## 🔒 Validaciones

### Frontend
- Validaciones en tiempo real en formularios
- Mensajes de error traducidos
- Validación de tipos de archivo
- Validación de tamaños de imagen

### Backend
- Validaciones con **Yup** en todas las APIs
- Schemas para productos (crear/actualizar)
- Schemas para autenticación (login/registro)
- Validación de categorías y subcategorías
- Validación de tipos MIME para imágenes

---

## Scripts Disponibles

```bash
npm run dev      # Desarrollo (localhost:3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
npm test         # Tests (Jest)
```

---

## Despliegue

El proyecto está configurado para desplegarse en **Vercel**:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Deploy automático en cada push

**Variables de entorno necesarias en Vercel:**
- `MONGODB_URI`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `MAIL_USER`
- `MAIL_PASS`
- `NEXT_PUBLIC_APP_URL`

---

## Autor

Susanagc 

---

## Licencia

Este proyecto es privado y está destinado para fines educativos.

---

**Si te gustó el proyecto, no olvides darle una estrella en GitHub!**
