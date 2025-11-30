# 📋 Plan de Trabajo - Techland E-commerce

## 🎯 Objetivo
Completar el e-commerce Techland con todas las funcionalidades profesionales.

---

## ✅ FASE 1: DESPLIEGUE INICIAL (AHORA)

### 🚀 Prioridad: ALTA
**Tiempo estimado:** 30 minutos

**Tareas:**
1. ✅ Preparar proyecto para Vercel
2. ✅ Configurar variables de entorno
3. ✅ Desplegar en Vercel
4. ✅ Verificar que todo funcione en producción

**Resultado:** Aplicación funcionando en producción

---

## 🔧 FASE 2: VALIDACIONES BACKEND (PRIMERO)

### 🎯 Prioridad: ALTA
**Tiempo estimado:** 2-3 horas

**Por qué primero:**
- ✅ Asegura la integridad de los datos
- ✅ Previene errores antes de agregar más funcionalidades
- ✅ Base sólida para todo lo demás

### 📦 Instalación:
```bash
npm install yup
```

### 📝 Tareas:

#### 2.1 Validar API de Productos
- [ ] Crear schema Yup para crear producto
- [ ] Crear schema Yup para actualizar producto
- [ ] Validar en `POST /api/products`
- [ ] Validar en `PUT /api/products/[id]`
- [ ] Mensajes de error traducidos (i18n)

#### 2.2 Validar API de Autenticación
- [ ] Crear schema Yup para login
- [ ] Crear schema Yup para registro
- [ ] Validar en `POST /api/auth/login`
- [ ] Validar en `POST /api/auth/register`
- [ ] Mensajes de error traducidos

#### 2.3 Validar otros endpoints
- [ ] Validar parámetros de query (GET /api/products)
- [ ] Validar IDs de MongoDB
- [ ] Validar tipos de archivo

**Archivos a modificar:**
- `src/app/api/products/route.ts`
- `src/app/api/products/[id]/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/register/route.ts`
- Crear: `src/lib/validations/productSchemas.ts`
- Crear: `src/lib/validations/authSchemas.ts`

---

## 📧 FASE 3: ENVÍO DE EMAILS (SEGUNDO)

### 🎯 Prioridad: MEDIA
**Tiempo estimado:** 3-4 horas

**Por qué segundo:**
- ✅ Funcionalidad independiente
- ✅ No afecta el flujo principal
- ✅ Puede usarse con cron jobs después

### 📦 Instalación:
```bash
npm install nodemailer
npm install @types/nodemailer --save-dev
```

### 📝 Tareas:

#### 3.1 Configurar Nodemailer
- [ ] Crear servicio de email (`src/lib/email.ts`)
- [ ] Configurar SMTP (Gmail, SendGrid, o Resend)
- [ ] Crear templates HTML para emails
- [ ] Variables de entorno para email

#### 3.2 Emails a implementar:
- [ ] Email de bienvenida (registro)
- [ ] Email de confirmación de pedido
- [ ] Email de recuperación de contraseña
- [ ] Email de notificación al admin (nuevo producto)
- [ ] Email de notificación al admin (nuevo usuario)

#### 3.3 Integrar en el flujo
- [ ] Enviar email después de registro
- [ ] Enviar email cuando se crea producto (admin)
- [ ] Preparar para cron jobs (reportes diarios)

**Archivos a crear:**
- `src/lib/email.ts`
- `src/lib/emailTemplates/welcome.ts`
- `src/lib/emailTemplates/orderConfirmation.ts`
- `src/lib/emailTemplates/passwordReset.ts`
- `src/app/api/email/send/route.ts`

**Variables de entorno necesarias:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
EMAIL_FROM=noreply@techland.com
```

---

## ⏰ FASE 4: CRON JOBS (TERCERO)

### 🎯 Prioridad: MEDIA
**Tiempo estimado:** 2-3 horas

**Por qué tercero:**
- ✅ Depende de emails funcionando
- ✅ Funcionalidad complementaria
- ✅ Puede probarse después del despliegue

### 📦 Opciones:

#### Opción A: Vercel Cron (Recomendado - Gratis)
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/daily-report",
    "schedule": "0 9 * * *"
  }]
}
```

#### Opción B: API Route + External Service
- Usar servicio externo (cron-job.org, EasyCron)
- Llamar a tu API route cada día

### 📝 Tareas:

#### 4.1 Crear API Route para Cron
- [ ] Crear `src/app/api/cron/daily-report/route.ts`
- [ ] Validar con header secreto (seguridad)
- [ ] Generar reporte diario
- [ ] Enviar email con reporte

#### 4.2 Reportes a implementar:
- [ ] Reporte diario de ventas (cuando implementes checkout)
- [ ] Reporte de productos más vendidos
- [ ] Reporte de productos con stock bajo
- [ ] Reporte de nuevos usuarios
- [ ] Reporte de productos destacados

#### 4.3 Configurar en Vercel
- [ ] Crear `vercel.json` con cron jobs
- [ ] Configurar schedule
- [ ] Probar localmente

**Archivos a crear:**
- `src/app/api/cron/daily-report/route.ts`
- `src/lib/reports/dailyReport.ts`
- `vercel.json` (si no existe)

**Variables de entorno:**
```
CRON_SECRET=tu-secret-random-para-seguridad
```

---

## 🧪 FASE 5: PRUEBAS (CUARTO)

### 🎯 Prioridad: MEDIA-ALTA
**Tiempo estimado:** 4-6 horas

**Por qué cuarto:**
- ✅ Necesitas funcionalidades completas para probar
- ✅ Asegura calidad antes de producción final
- ✅ Puede hacerse en paralelo con otras tareas

### 📦 Instalación:
```bash
npm install cypress --save-dev
```

### 📝 Tareas:

#### 5.1 Configurar Cypress
- [ ] Instalar Cypress
- [ ] Configurar `cypress.config.ts`
- [ ] Crear estructura de carpetas
- [ ] Configurar scripts en `package.json`

#### 5.2 Pruebas E2E a crear:

**Flujo de Usuario:**
- [ ] Navegar por la tienda
- [ ] Buscar productos
- [ ] Filtrar por categoría
- [ ] Agregar al carrito
- [ ] Ver detalles de producto
- [ ] Cambiar idioma

**Flujo de Autenticación:**
- [ ] Registro de usuario
- [ ] Login de usuario
- [ ] Login con Google
- [ ] Logout

**Flujo de Admin:**
- [ ] Login como admin
- [ ] Crear producto
- [ ] Editar producto
- [ ] Eliminar producto
- [ ] Ver dashboard

#### 5.3 Pruebas Unitarias (Jest ya está configurado)
- [ ] Pruebas de utilidades (`formatPrice`, etc.)
- [ ] Pruebas de validaciones (Yup schemas)
- [ ] Pruebas de componentes (React Testing Library)

**Archivos a crear:**
- `cypress.config.ts`
- `cypress/e2e/user-flow.cy.ts`
- `cypress/e2e/auth-flow.cy.ts`
- `cypress/e2e/admin-flow.cy.ts`
- `cypress/support/commands.ts`
- `src/__tests__/utils.test.ts`
- `src/__tests__/components/Button.test.tsx`

---

## 📊 RESUMEN DEL PLAN

| Fase | Prioridad | Tiempo | Dependencias |
|------|-----------|--------|--------------|
| 1. Despliegue | 🔴 ALTA | 30 min | Ninguna |
| 2. Validaciones | 🔴 ALTA | 2-3h | Ninguna |
| 3. Emails | 🟡 MEDIA | 3-4h | Ninguna |
| 4. Cron Jobs | 🟡 MEDIA | 2-3h | Emails |
| 5. Pruebas | 🟡 MEDIA | 4-6h | Todas |

**Tiempo total estimado:** 12-17 horas

---

## 🎯 ORDEN RECOMENDADO DE EJECUCIÓN

1. ✅ **Desplegar en Vercel** (30 min) - Para tener algo funcionando
2. ✅ **Validaciones Backend** (2-3h) - Base sólida
3. ✅ **Envío de Emails** (3-4h) - Funcionalidad independiente
4. ✅ **Cron Jobs** (2-3h) - Usa emails
5. ✅ **Pruebas** (4-6h) - Puede hacerse en paralelo

---

## 💡 CONSEJOS

### Para cada fase:
1. **Crear una rama Git:** `git checkout -b feature/nombre-funcionalidad`
2. **Hacer commits frecuentes:** Cada tarea completada
3. **Probar localmente:** Antes de mergear
4. **Documentar:** Agregar comentarios y actualizar README

### Workflow recomendado:
```bash
# 1. Crear rama
git checkout -b feature/validaciones-backend

# 2. Trabajar en la funcionalidad
# ... hacer cambios ...

# 3. Commit
git add .
git commit -m "feat: agregar validaciones Yup en productos"

# 4. Push
git push origin feature/validaciones-backend

# 5. Merge a main (después de revisar)
git checkout main
git merge feature/validaciones-backend
```

---

## 🚀 ¿Empezamos?

**Siguiente paso:** Desplegar en Vercel (30 minutos)

¿Listo para empezar? 🎉

