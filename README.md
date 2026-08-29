# ShellBox Encargos

> Todo lo que te gusta, hasta tus manos

Web de ShellBox Encargos, agencia intermediaria de transporte de **Estados Unidos a Cuba**.
El cliente compra en cualquier tienda con envío a EEUU, envía el enlace o el carrito, y
ShellBox se encarga de la compra y del traslado hasta La Habana.

## 📋 Reglas del negocio

Todas las tarifas, tiempos y datos de contacto viven en un único sitio,
[`src/lib/config.ts`](src/lib/config.ts). Si cambian las condiciones se toca ese archivo y
la web entera se actualiza sola.

| Concepto | Valor |
| :------- | :---- |
| Miscelánea | 6 USD / libra — entrega de 5 a 7 días |
| Carga y sobredimensionado | 3 USD / libra — entrega de 40 a 45 días |
| Pago | En USD, al recibir la mercancía en Cuba (efectivo desde 20 USD, o Zelle) |
| Recogida | El Vedado, La Habana — 7 días hábiles de plazo |

Los términos y condiciones completos se publican en `/terminos`.

## ✨ Características

- **Modo claro y oscuro**, con detección de la preferencia del sistema y sin parpadeo inicial
- **Identidad de marca**: paleta tomada del logo (ámbar → coral → rosa, con teal de apoyo)
- **Animaciones** de aparición al hacer scroll, respetando `prefers-reduced-motion`
- **Catálogo de stock** conectado a MongoDB, con filtros por categoría y búsqueda
- **Panel de administración** con subida de imágenes al bucket S3
- **Stack**: Astro 5 (SSR) + Svelte 5 + Tailwind CSS 4 + MongoDB

## 🚀 Comandos

| Comando | Acción |
| :------ | :----- |
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Construir para producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run init:admin` | Crear el primer usuario administrador |

## 🔐 Variables de entorno

Ninguna tiene valor por defecto: la aplicación falla al arrancar si falta alguna de las
obligatorias, en lugar de arrancar con una configuración insegura.

| Variable | Obligatoria | Para qué |
| :------- | :---------- | :------- |
| `MONGODB_URI` | Sí | Conexión a MongoDB |
| `JWT_SECRET` | Sí | Firma de los tokens de sesión del panel |
| `AWS_S3_BUCKET_NAME` | Para imágenes | Bucket donde se guardan las fotos de productos |
| `AWS_ENDPOINT_URL` | Para imágenes | Endpoint compatible con S3 |
| `AWS_ACCESS_KEY_ID` | Para imágenes | Credencial del bucket |
| `AWS_SECRET_ACCESS_KEY` | Para imágenes | Credencial del bucket |
| `AWS_DEFAULT_REGION` | Para imágenes | Región del bucket |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Solo para `init:admin` | Credenciales del primer admin |

Copia [`.env.example`](.env.example) a `.env` para desarrollo local.

## 🏗️ Estructura

```text
src/
├── components/
│   ├── admin/          Panel: login, listado, formulario de producto
│   ├── sections/       Secciones de la portada
│   ├── ui/             Catálogo y tarjeta de producto
│   ├── Header.svelte   Navegación y selector de tema
│   └── Footer.astro
├── layouts/
│   └── BaseLayout.astro   Metadatos, tema sin parpadeo, observador de scroll
├── lib/
│   ├── config.ts       Reglas del negocio (tarifas, pasos, FAQ, contacto)
│   ├── types.ts        Tipos compartidos y resolución de URLs de imagen
│   ├── db.ts           Conexión a MongoDB
│   ├── auth.ts         Firma y verificación de tokens
│   ├── s3.ts           Subida, lectura y borrado en el bucket
│   ├── middleware/     Comprobación de token y rol
│   └── models/         Esquemas de Mongoose
├── pages/
│   ├── index.astro     Portada
│   ├── stock.astro     Catálogo (lee de MongoDB en el servidor)
│   ├── terminos.astro  Términos y condiciones
│   ├── admin.astro     Panel
│   └── api/            Endpoints
└── styles/
    └── global.css      Tokens de color, modo oscuro y animaciones
```

## 🔌 API

| Método | Ruta | Acceso |
| :----- | :--- | :----- |
| `GET` | `/api/products` | Público — admite `?category=` y `?available=true` |
| `POST` | `/api/products` | Admin |
| `GET` | `/api/products/:id` | Público |
| `PUT` | `/api/products/:id` | Admin |
| `DELETE` | `/api/products/:id` | Admin — borra también sus imágenes del bucket |
| `POST` | `/api/upload` | Admin — sube imágenes y devuelve sus claves |
| `GET` | `/api/images/*` | Público — sirve las imágenes del bucket privado |
| `POST` | `/api/auth/login` | Público |
| `GET` | `/api/auth/verify` | Público — valida el token recibido |

## 🚢 Despliegue

Desplegado en Railway con el adaptador de Node en modo SSR. Railway ejecuta
`npm run build` y luego `npm run start`. Consulta [SETUP.md](SETUP.md) para el detalle.

---

Desarrollado para **ShellBox Encargos** 🇺🇸🇨🇺
