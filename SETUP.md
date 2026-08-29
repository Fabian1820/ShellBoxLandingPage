# 🚀 Setup de ShellBox con MongoDB

Este documento explica cómo configurar y desplegar ShellBox con autenticación y MongoDB.

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Acceso a una base de datos MongoDB (Railway en este caso)
- Cuenta de Railway para deployment

## 🔧 Instalación Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (ya existe un `.env.example` que puedes copiar):

```bash
# MongoDB Connection
MONGODB_URI=mongodb://usuario:contraseña@host:puerto/shellbox?authSource=admin

# JWT Secret (cambiar en producción)
JWT_SECRET=shellbox-secret-key-change-in-production
```

⚠️ **IMPORTANTE**: En producción, cambia `JWT_SECRET` por una clave secreta única y segura.

### 3. Inicializar usuario admin

Ejecuta el script para crear el primer usuario administrador:

```bash
npm run init:admin
```

Esto creará un usuario con las siguientes credenciales:
- **Email**: `admin@shellbox.com`
- **Contraseña**: `admin123`

⚠️ **IMPORTANTE**: Cambia esta contraseña después del primer login en producción.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

El sitio estará disponible en: `http://localhost:4321`

## 🔐 Panel Administrativo

### Acceso

- URL: `/admin`
- Email: `admin@shellbox.com`
- Contraseña: `admin123` (cambiar después del primer login)

### Funcionalidades

- ✅ Login con autenticación JWT
- ✅ CRUD completo de productos
- ✅ Protección de rutas API
- ✅ Almacenamiento en MongoDB
- ✅ Cerrar sesión

## 🗄️ Estructura de Base de Datos

### Base de datos: `shellbox`

### Colección: `products`

```javascript
{
  "_id": ObjectId,
  "id": String,              // ID único del producto
  "name": String,            // Nombre del producto
  "price": Number,           // Precio en EUR
  "description": String,     // Descripción
  "category": String,        // Categoría
  "subcategory": String,     // Subcategoría (opcional)
  "sizes": [String],         // Tallas disponibles
  "colors": [{
    "name": String,
    "hex": String
  }],
  "images": [String],        // URLs de imágenes
  "featured": Boolean,       // Destacado
  "new": Boolean,            // Nuevo
  "available": Boolean,      // Disponible
  "createdAt": Date,
  "updatedAt": Date
}
```

### Colección: `admins`

```javascript
{
  "_id": ObjectId,
  "email": String,           // Email único
  "password": String,        // Contraseña encriptada con bcrypt
  "role": String,            // "admin"
  "createdAt": Date,
  "updatedAt": Date
}
```

## 🚢 Deployment en Railway

### 1. Variables de entorno en Railway

Configura estas variables de entorno en Railway:

```
MONGODB_URI=mongodb://usuario:contraseña@host:puerto/shellbox?authSource=admin
JWT_SECRET=TU_CLAVE_SECRETA_SEGURA_AQUI
```

### 2. Inicializar admin en producción

Después del primer deploy, ejecuta el script de inicialización:

```bash
npm run init:admin
```

O usa la API de registro (solo para el primer admin):

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@shellbox.com",
  "password": "tu_contraseña_segura"
}
```

⚠️ **IMPORTANTE**: Considera deshabilitar la ruta `/api/auth/register` después de crear el primer admin.

### 3. Build y Start

Railway automáticamente ejecutará:

```bash
npm run build  # Construir la aplicación
npm run start  # Iniciar el servidor
```

## 🔒 Seguridad

### Contraseñas

- ✅ Las contraseñas se encriptan con bcrypt (10 rounds de salt)
- ✅ Nunca se almacenan en texto plano
- ✅ Se comparan usando el método `comparePassword` del modelo

### Tokens JWT

- ✅ Tokens firmados con JWT_SECRET
- ✅ Expiración de 7 días
- ✅ Almacenados en localStorage del navegador
- ✅ Enviados en header `Authorization: Bearer <token>`

### Rutas Protegidas

Las siguientes rutas requieren autenticación:

- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

Las rutas públicas:

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto

## 📝 API Endpoints

### Autenticación

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@shellbox.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@shellbox.com",
    "role": "admin"
  }
}
```

#### Verificar Token
```bash
GET /api/auth/verify
Authorization: Bearer <token>

Response:
{
  "valid": true,
  "user": {
    "email": "admin@shellbox.com",
    "role": "admin"
  }
}
```

### Productos

#### Obtener todos los productos
```bash
GET /api/products
```

#### Crear producto (requiere auth)
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Producto ejemplo",
  "price": 29.99,
  "description": "Descripción del producto",
  "category": "Ropa",
  "images": ["url_imagen"],
  "available": true,
  "featured": false,
  "new": true
}
```

#### Actualizar producto (requiere auth)
```bash
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Producto actualizado",
  "price": 39.99
}
```

#### Eliminar producto (requiere auth)
```bash
DELETE /api/products/:id
Authorization: Bearer <token>
```

## 🐛 Troubleshooting

### Error: No se puede conectar a MongoDB

Verifica que la URL de MongoDB sea correcta y que la base de datos esté accesible.

### Error: Token inválido

El token puede haber expirado (7 días). Haz login nuevamente.

### Error: Credenciales inválidas

Verifica que el email y contraseña sean correctos. El email no distingue mayúsculas/minúsculas.

## 📚 Próximos Pasos

- [ ] Implementar cambio de contraseña
- [ ] Añadir recuperación de contraseña
- [ ] Implementar roles y permisos más granulares
- [ ] Añadir subida de imágenes (Cloudinary/S3)
- [ ] Implementar paginación de productos
- [ ] Añadir búsqueda y filtros

## 📞 Soporte

Para más información, consulta el archivo [CLAUDE.md](./CLAUDE.md) con las especificaciones completas del proyecto.
