# ShellBox Encargos

> Todo lo que te gusta, más cerca

Landing page moderna para ShellBox, empresa dedicada a envíos de productos desde España. Diseñado siguiendo los principios de Apple UI para una experiencia de usuario excepcional.

## ✨ Características

- **Diseño Premium**: Interfaz limpia y moderna inspirada en Apple UI
- **Responsive**: Funciona perfectamente en todos los dispositivos
- **Stack Moderno**: Astro 5 + Svelte 5 + Tailwind CSS 4
- **Rendimiento Optimizado**: Carga rápida y transiciones suaves
- **SEO Optimizado**: Meta tags y estructura semántica

## 🚀 Comandos

| Comando | Acción |
| :------ | :----- |
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Construir para producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run preview` | Previsualizar build |

## 🏗️ Estructura del Proyecto

```text
ShellBox/
├── public/
│   └── shellboxlogo.jpg
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.svelte
│   │   │   ├── Features.astro
│   │   │   └── HowItWorks.astro
│   │   ├── ui/
│   │   │   ├── ProductCard.svelte
│   │   │   └── ScrollReveal.svelte
│   │   ├── Header.svelte
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── stock.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
└── package.json
```

## 🎨 Principios de Diseño

- **Claridad Visual**: Una intención principal por sección
- **Jerarquía Clara**: Tamaños de fuente y espaciado consistentes
- **Tipografía**: Font Inter para legibilidad óptima
- **Espacio Negativo**: Márgenes amplios para sensación premium
- **Interacciones Suaves**: Transiciones fluidas y naturales
- **Consistencia**: Estilos uniformes en todo el sitio
- **Color con Propósito**: Paleta limitada y significativa

## 🎨 Paleta de Colores

```css
--orange-500: #F97316;  /* Acción principal */
--gray-50:    #F9FAFB;  /* Fondo suave */
--gray-900:   #111827;  /* Texto principal */
--white:      #FFFFFF;  /* Fondo */
```

## 📦 Funcionalidades

### Landing Page
- Hero minimalista con mensaje claro
- Sección de características con iconografía simple
- Proceso explicado en pasos visuales
- Footer con enlaces de contacto

### Página de Stock
- Catálogo de productos disponibles
- Grid responsivo
- Tarjetas de producto estilo Apple
- Integración con WhatsApp para consultas

## 📞 Contacto

- **Instagram**: [@shellboxencargos](https://www.instagram.com/shellboxencargos/)
- **WhatsApp**: +53 5 6844243
- **Canal WhatsApp**: [Unirse al canal](https://whatsapp.com/channel/0029Vb7uvLt4o7qO1HnG1B2u)

## 🛠️ Tecnologías

- [Astro 5](https://astro.build) - Framework web con SSR
- [Svelte 5](https://svelte.dev) - Framework UI reactivo
- [Tailwind CSS 4](https://tailwindcss.com) - Framework CSS moderno
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) - Adaptador para deployment

## 🚀 Deployment

Este proyecto está configurado para desplegarse en Railway con Node.js adapter:

1. Build automático con `npm run build`
2. Servidor Node.js con `npm run start`
3. Modo SSR para mejor rendimiento y SEO

---

Desarrollado con dedicación para **ShellBox Encargos** 🇨🇺🇪🇸
