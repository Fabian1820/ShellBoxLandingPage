# ShellBox Encargos

> Todo lo que te gusta, más cerca

Sitio web premium para ShellBox, empresa cubana-española dedicada a envíos de productos Shein desde España a Cuba. Diseñado siguiendo los principios de Apple UI para una experiencia de usuario excepcional.

## ✨ Características

- **Diseño Apple UI Premium**: Implementa los 12 principios de diseño de Apple
- **Panel Administrativo**: Sistema CRUD completo para gestión de productos
- **Stack Tecnológico**: Astro 5 + Svelte 5 + Tailwind CSS 4
- **Rendimiento Optimizado**: Carga rápida, lazy loading, transiciones suaves
- **Responsive & Accesible**: Funciona perfectamente en todos los dispositivos
- **SEO Optimizado**: Meta tags, Open Graph, y estructura semántica

## 🎨 Principios de Diseño Apple Implementados

### 1. Claridad Visual
- Una intención principal por sección
- Hero centrado en el mensaje clave
- Jerarquía clara de información

### 2. Jerarquía Súper Marcada
- Tamaños de fuente: 6xl para títulos, xl para subtítulos, base para cuerpo
- Peso tipográfico: semibold para títulos, medium para énfasis, light para secundario
- Espaciado generoso entre secciones (py-32)

### 3. Tipografía como Estructura
- **Font Inter**: Similar a San Francisco de Apple
- Letter spacing ajustado (-0.025em)
- Line height óptimo (1.7 para párrafos)
- Antialiasing y subpixel rendering

### 4. Espacio Negativo (Aire)
- Márgenes amplios entre elementos
- Padding generoso en tarjetas y secciones
- Sensación de "lujo" y premium

### 5. Interacciones Suaves
- Transiciones de 200-300ms
- Cubic-bezier easing para naturalidad
- Microanimaciones explicativas
- Feedback visual en hover/active

### 6. Consistencia Obsesiva
- Mismos bordes redondeados (rounded-xl, rounded-2xl)
- Botones con mismo estilo en todo el sitio
- Iconos con grosor 1.5
- Espaciado uniforme

### 7. Controles Discretos
- Botones con colores sutiles
- Header minimalista y discreto
- Navegación no invasiva

### 8. Color con Propósito
- **Naranja (#F97316)**: Acción principal
- **Grises**: Estructura y jerarquía
- **Blanco**: Fondo limpio
- Color limitado = significado claro

### 9. Iconografía Simple
- SVG con grosor consistente (stroke-width: 1.5)
- Formas geométricas simples
- Tamaños proporcionales

### 10. Profundidad Elegante
- Sombras muy suaves
- Backdrop blur en elementos flotantes
- Transparencias sutiles (bg-white/80)

### 11. Menos Opciones Visibles
- Interfaz simplificada
- Acciones contextuales
- Flujo guiado

### 12. Accesibilidad Integrada
- Contraste suficiente (WCAG AA)
- Tamaños de fuente legibles
- Áreas de toque de 44px mínimo

## 🏗️ Estructura del Proyecto

```text
ShellBox/
├── public/
│   └── shellboxlogo.jpeg
├── src/
│   ├── components/
│   │   ├── admin/                 # Panel administrativo
│   │   │   ├── AdminPanel.svelte  # Orquestador principal
│   │   │   ├── ProductList.svelte # Lista de productos
│   │   │   └── ProductForm.svelte # Formulario CRUD
│   │   ├── sections/              # Secciones landing
│   │   │   ├── Hero.svelte
│   │   │   ├── Features.astro
│   │   │   └── HowItWorks.astro
│   │   ├── ui/                    # Componentes UI
│   │   │   ├── ProductCard.svelte
│   │   │   └── ScrollReveal.svelte
│   │   ├── Header.svelte
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   └── productStore.ts        # Store de productos
│   ├── pages/
│   │   ├── api/                   # API REST
│   │   │   └── products/
│   │   │       ├── index.ts       # GET/POST
│   │   │       └── [id].ts        # GET/PUT/DELETE
│   │   ├── index.astro            # Landing
│   │   ├── stock.astro            # Catálogo
│   │   └── admin.astro            # Panel admin
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── svelte.config.js
└── package.json
```

## 🚀 Comandos

| Comando | Acción |
| :------ | :----- |
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Construir para producción |
| `npm run preview` | Previsualizar build |

## 🔐 Panel Administrativo

El panel administrativo está disponible en la ruta `/admin` (no accesible desde la UI pública).

### Características del Admin

- **CRUD Completo**: Crear, leer, actualizar y eliminar productos
- **Interfaz Apple UI**: Diseño minimalista y elegante
- **Validación en tiempo real**: Formularios con feedback inmediato
- **Vista previa de imágenes**: Al agregar/editar productos
- **Notificaciones**: Feedback visual de acciones exitosas/fallidas
- **Responsive**: Funciona en desktop y tablet

### Usar el Admin

1. Acceder a `http://localhost:4321/admin`
2. Ver lista de productos actual
3. Botón "Nuevo Producto" para agregar
4. Botones "Editar" y "Eliminar" en cada fila
5. Formulario modal para crear/editar
6. Las categorías son: Ropa, Calzado, Accesorios, Deportes, Otros

### API REST

```typescript
GET    /api/products      // Obtener todos los productos
POST   /api/products      // Crear nuevo producto
GET    /api/products/:id  // Obtener producto por ID
PUT    /api/products/:id  // Actualizar producto
DELETE /api/products/:id  // Eliminar producto
```

## 📦 Funcionalidades

### Landing Page
- Hero minimalista con mensaje claro
- Características diferenciadoras con iconografía simple
- Proceso en 4 pasos con diseño limpio
- Footer con enlaces de contacto

### Página de Stock
- Grid responsivo de productos
- Filtros por categoría
- Tarjetas de producto estilo Apple
- Botón WhatsApp en cada producto
- Estado de disponibilidad visual

### Panel Admin
- Tabla con todos los productos
- Formulario modal para CRUD
- Vista previa de imágenes
- Validación de formularios
- Sistema de notificaciones

## 🎨 Paleta de Colores

```css
/* Principales */
--orange-500: #F97316;  /* Acción principal */
--gray-50:    #F9FAFB;  /* Fondo suave */
--gray-100:   #F3F4F6;  /* Fondo elementos */
--gray-500:   #6B7280;  /* Texto secundario */
--gray-900:   #111827;  /* Texto principal */
--white:      #FFFFFF;  /* Fondo */

/* Semánticos */
--green-500:  #10B981;  /* Éxito */
--red-500:    #EF4444;  /* Error */
```

## 🔮 Próximas Características

- [x] Panel administrativo CRUD
- [x] API REST para productos
- [x] Diseño Apple UI completo
- [ ] Integración con MongoDB
- [ ] Autenticación en panel admin
- [ ] Sistema de categorías dinámico
- [ ] Búsqueda de productos
- [ ] Carga de imágenes a servidor

## 📞 Contacto

- **Instagram**: [@shellboxencargos](https://www.instagram.com/shellboxencargos/)
- **WhatsApp**: +53 5 6844243
- **Canal WhatsApp**: [Unirse al canal](https://whatsapp.com/channel/0029Vb7uvLt4o7qO1HnG1B2u)

## 🛠️ Tecnologías

- [Astro 5.16.6](https://astro.build) - Framework web
- [Svelte 5.46.1](https://svelte.dev) - Framework UI (con Runes)
- [Tailwind CSS 4.1.18](https://tailwindcss.com) - Framework CSS
- [TypeScript 5.9.3](https://www.typescriptlang.org/) - Tipado estático
- [Inter Font](https://fonts.google.com/specimen/Inter) - Tipografía

## 📝 Notas de Implementación

### Store de Productos
Actualmente los productos se gestionan en memoria con `productStore.ts`. Para producción:

1. Conectar con MongoDB usando Mongoose o driver nativo
2. Actualizar funciones del store para usar la BD
3. Agregar autenticación al panel admin
4. Implementar upload de imágenes

### Mejores Prácticas Aplicadas

- Arquitectura limpia y modular
- Componentes reutilizables
- Tipado estático con TypeScript
- API REST siguiendo convenciones
- Optimización de rendimiento
- Accesibilidad (contraste, tamaños, semántica)

---

Desarrollado con dedicación para **ShellBox Encargos** 🇨🇺🇪🇸
