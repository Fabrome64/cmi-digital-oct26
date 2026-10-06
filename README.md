# 🚀 CMI DIGITAL - Aplicación Web Full-Stack & PWA

Aplicación web profesional, moderna, escalable y PWA para **CMI DIGITAL** (Impresiones Gran Formato, Marketing Digital y Desarrollo Web). Desarrollada con Next.js 14/15, TypeScript, Tailwind CSS, Prisma ORM y SQLite.

---

## 🌟 Características Principales

- **Frontend Público Dinámico**:
  - Header & Footer con esquema cromático institucional (`#FFD400`, gama de Azules para Desarrollo Web, Cyans para Marketing en Redes y Amarillos para Impresiones).
  - Sección Hero con botones CTA y microanimaciones.
  - Sección **Diseño Web** con 12 beneficios interactivos y **Portfolio de Sitios Web Dinámico**.
  - Sección **Marketing en Redes** con 12 ventajas y **Catálogo de Servicios Dinámico**.
  - Sección **Impresiones Gran Formato** con 12 cajas de productos y **Catálogo Autoadministrable**.
  - Formulario **Solicitá tu Presupuesto** con guardado relacional en base de datos.
  - Sección **Contacto & Ubicación** en Paraná 19, San José de Feliciano (Entre Ríos) con iframe de Google Maps centrado y botones a WhatsApp.

- **Panel Administrativo Privado (`/admin`)**:
  - Autenticación segura JWT en cookies `HttpOnly` y contraseñas hasheadas con `bcrypt`.
  - **Dashboard** con 6 tarjetas de métricas KPI en tiempo real y gráficos estadísticos (Recharts).
  - **Alertas de Stock Mínimo** automáticas para insumos de imprenta.
  - 10+ Módulos CRUD integrales: Clientes, Abonos Sitios Web, Insumos, Productos, Gastos, Portfolio Web, Servicios Marketing, Presupuestos, Sistema de Medios y Configuración Global.

- **PWA & SEO Técnico**:
  - Compatible con PWA (`manifest.json` + `sw.js` Service Worker) y banner interactivo "INSTALAR CMI DIGITAL".
  - Meta-tags Open Graph, Twitter Cards, Schema.org `LocalBusiness`, `sitemap.xml` y `robots.txt` automáticos.

---

## 🔑 Credenciales de Acceso DEMO

- **URL Panel**: `http://localhost:3000/admin/login`
- **Email**: `admin@cmidigital.com`
- **Contraseña**: `admin123`

---

## 🛠️ Instalación y Configuración Local

1. **Clonar o navegar al directorio del proyecto**:
   ```bash
   cd cmi-digital
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno (`.env`)**:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="cmi_digital_secret_jwt_key_2026_super_secure"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   NEXT_PUBLIC_WHATSAPP_NUMBER="5493437421589"
   ```

4. **Sincronizar base de datos y cargar datos DEMO**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Iniciar en modo desarrollo**:
   ```bash
   npm run dev
   ```
   Abrir en el navegador: `http://localhost:3000`

---

## 🏗️ Compilación para Producción

```bash
npm run build
npm start
```

---

## 📋 Entregables Verificados (Punto 42)

- [x] Frontend público 100% funcional.
- [x] Backend API REST funcional.
- [x] Base de datos relacional SQLite con Prisma ORM.
- [x] Autenticación y Login administrativo.
- [x] Dashboard con métricas y gráficos.
- [x] CRUD Clientes.
- [x] CRUD Portfolio.
- [x] CRUD Servicios Marketing.
- [x] CRUD Productos Impresión.
- [x] CRUD Presupuestos.
- [x] CRUD Insumos con alerta de stock.
- [x] CRUD Gastos con resumen financiero.
- [x] CRUD Abonos Web con alertas de vencimiento.
- [x] Sistema centralizado de medios/imágenes.
- [x] Formulario de Presupuesto funcional con alertas y estados de carga.
- [x] Integración de WhatsApp con mensajes preconfigurados por servicio.
- [x] Google Maps oficial de San José de Feliciano.
- [x] Diseño 100% Responsive (Mobile, Tablet, Desktop).
- [x] PWA instalable con Service Worker.
- [x] SEO Técnico & Schema.org.
- [x] Seguridad, hashes de clave y sanitización.
- [x] Datos DEMO sembrados (5 clientes, 5 portfolios, 8 servicios, 10 productos, 5 presupuestos, 5 gastos, 5 insumos, 3 abonos).
- [x] Variables de entorno documentadas.
