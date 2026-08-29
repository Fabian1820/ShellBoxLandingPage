# 🚀 Setup de ShellBox

Cómo configurar, ejecutar y desplegar la web de ShellBox Encargos.

## 📋 Requisitos previos

- Node.js 18 o superior
- Una base de datos MongoDB (en producción, el servicio MongoDB del proyecto de Railway)
- Un bucket compatible con S3 para las imágenes de producto (opcional, pero sin él el
  panel no puede subir fotos)

## 🔧 Instalación local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y rellena los valores. **Ninguna variable obligatoria tiene
valor por defecto**: la aplicación falla al arrancar si falta, en lugar de arrancar con una
configuración insegura.

```bash
cp .env.example .env
```

Para generar un `JWT_SECRET` propio:

```bash
openssl rand -base64 32
```

> ⚠️ Nunca escribas credenciales reales en `.env.example`, en el README ni en este archivo:
> son ficheros versionados y acabarían públicos en GitHub.

### 3. Crear el usuario administrador

El script exige `MONGODB_URI`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el entorno. No hay
usuario ni contraseña por defecto.

```bash
npm run init:admin
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Disponible en `http://localhost:4321`. El panel está en `/admin`.

## 🔐 Panel de administración

Desde `/admin` se gestiona el catálogo que se publica en `/stock`:

- Alta, edición y borrado de productos
- Subida de hasta 8 imágenes por producto, con reordenación (la primera es la portada)
- Tallas, colores, categoría y subcategoría
- Marcas de disponible, destacado y nuevo

Al eliminar un producto se borran también sus imágenes del bucket, para que no queden
archivos huérfanos ocupando espacio.

## 🗄️ Base de datos

### Colección `products`

```javascript
{
  "_id": ObjectId,
  "id": String,              // Referencia visible del producto
  "name": String,
  "price": Number,           // Precio en USD
  "description": String,     // Obligatoria
  "category": String,        // Obligatoria
  "subcategory": String,     // Opcional
  "sizes": [String],
  "colors": [{ "name": String, "hex": String }],
  "images": [String],        // CLAVES del bucket, no URLs
  "featured": Boolean,
  "new": Boolean,
  "available": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

> `images` guarda claves del bucket (`products/<marca-de-tiempo>-<aleatorio>-<nombre>.jpg`),
> no URLs completas. El bucket es privado: las imágenes se sirven a través de
> `/api/images/<clave>`, que las lee con las credenciales del servidor y las cachea.

### Colección `admins`

```javascript
{
  "_id": ObjectId,
  "email": String,           // Único
  "password": String,        // Hash bcrypt
  "role": String,            // "admin"
  "createdAt": Date,
  "updatedAt": Date
}
```

## 🚢 Despliegue en Railway

### 1. Variables de entorno

En el servicio `ShellBoxLandingPage` deben estar definidas:

```
MONGODB_URI          → referencia al servicio Mongo: ${{MongoDB.MONGO_URL}}/shellbox?authSource=admin
JWT_SECRET           → clave propia generada con openssl
AWS_S3_BUCKET_NAME   → nombre del bucket
AWS_ENDPOINT_URL     → endpoint compatible con S3
AWS_ACCESS_KEY_ID    → credencial del bucket
AWS_SECRET_ACCESS_KEY→ credencial del bucket
AWS_DEFAULT_REGION   → región del bucket
```

### 2. Build y arranque

Railway ejecuta automáticamente:

```bash
npm run build
npm run start
```

### 3. Crear el admin en producción

```bash
railway run npm run init:admin
```

pasando `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el entorno. **No existe endpoint público de
registro**: se retiró para que nadie pueda crearse una cuenta de administrador.

## 🔒 Seguridad

**Contraseñas**

- Se cifran con bcrypt (10 rondas de sal) y nunca se guardan en claro.
- Se comparan con el método `comparePassword` del modelo.

**Tokens JWT**

- Firmados con `JWT_SECRET`, que no tiene valor por defecto.
- Caducan a los 7 días.
- Se guardan en `localStorage` y viajan en la cabecera `Authorization: Bearer <token>`.
- Al recibir un 401 o 403, el panel cierra la sesión y vuelve al login.

**Rutas protegidas** — requieren token válido **y** rol `admin`:

- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/upload`

En las actualizaciones solo se aceptan campos de una lista blanca, de modo que un cliente
no puede reescribir el `id` del documento ni inyectar campos ajenos al esquema.

**Subida de archivos**

- Solo se admiten JPEG, PNG, WebP, AVIF y GIF.
- Máximo 8 MB por archivo y 8 imágenes por producto.
- El lote se valida entero antes de subir nada.
