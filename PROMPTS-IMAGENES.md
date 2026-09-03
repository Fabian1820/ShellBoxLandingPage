# Prompts para generar las imágenes

Guía para producir las fotos del sitio con IA (Midjourney, DALL·E, Flux, Ideogram,
Firefly…) de forma que todas parezcan de la misma sesión fotográfica.

## Antes de empezar

**La paleta de ShellBox**, para incluirla en los prompts:

| Color | Hex | Papel |
| :---- | :-- | :---- |
| Ámbar | `#F7941D` | Luz cálida, acentos |
| Coral | `#EE4E34` | Color principal de marca |
| Rosa | `#E5497E` | Acento secundario |
| Teal | `#3F918F` | Contrapunto frío |
| Crema | `#FAF7F5` | Fondos claros |

**Reglas para que todo case:**

- Pide siempre **luz cálida lateral** y **sombras suaves y largas**. Es lo que unifica
  la serie.
- Evita texto en la imagen: los generadores lo escriben mal y además la web ya pone
  el suyo encima.
- Nada de logotipos de marcas reales (Amazon, Shein…): problemas de derechos y suelen
  salir deformados.
- Genera en **16:9** para las bandas anchas y **3:2** para el hero.
- Exporta a **WebP** con calidad 80 antes de subirlas: pesan la mitad que un JPEG.

## Dónde va cada imagen

Guarda los archivos en `public/fotos/` con **exactamente** estos nombres. El código ya
los busca: si el archivo existe se usa, y si no, la sección se dibuja con el degradado
de marca sin romperse.

| Archivo | Dónde sale | Proporción |
| :------ | :--------- | :--------- |
| `hero-cajas.jpg` | Fondo del hero, al 14% de opacidad | 3:2 |
| `entrega-vedado.jpg` | Banda ancha entre «Cómo funciona» y «Ventajas» | 16:9 |
| `textura-carton.jpg` | Textura sobre el degradado del cierre | 16:9 |

---

## 1. Fondo del hero — `hero-cajas.jpg`

Va al 14% de opacidad detrás del texto, así que **cuanto más simple, mejor**: si tiene
mucho detalle, ensucia la lectura del titular.

```
Overhead flat lay of neatly arranged cardboard shipping boxes and paper-wrapped
parcels on a warm cream surface, soft natural window light from the left casting
long gentle shadows, minimal composition with generous empty space, muted warm
color palette of amber #F7941D and terracotta #EE4E34 accents, subtle kraft paper
textures, shallow depth of field, editorial product photography, clean and airy,
no text, no logos, no people --ar 3:2 --style raw
```

**Variante con más color de marca** (si la anterior sale demasiado apagada):

```
Top-down arrangement of kraft cardboard boxes tied with coral and pink ribbons on
a cream backdrop, one box slightly open revealing folded clothing in soft teal and
blush tones, warm golden hour light, long soft shadows, lots of negative space in
the upper left, muted editorial palette, high-end catalog photography, no text,
no branding --ar 3:2 --style raw
```

## 2. Banda de entrega — `entrega-vedado.jpg`

Lleva un velo oscuro encima y el texto va a la **izquierda**: pide la composición
cargada a la derecha para que no se tape nada importante.

```
Warm documentary photograph of hands receiving a stack of cardboard parcels,
shot from a low three-quarter angle, golden afternoon light streaming from the
right, subject positioned on the right third of the frame with soft blurred
interior background on the left, warm terracotta and amber tones, genuine and
unposed, cinematic color grading, shallow depth of field, no text, no visible
faces --ar 16:9 --style raw
```

**Alternativa: el almacén** (más «prueba de que existe la operación»):

```
Neatly stacked cardboard boxes of varying sizes against a warm cream wall, soft
directional light from the right creating long diagonal shadows, organized and
professional small logistics space, warm amber and coral color grading, clean
minimal composition with empty space on the left half, editorial documentary
photography, no text, no logos --ar 16:9 --style raw
```

**Alternativa: llegada a Cuba** (la más emotiva, si te encaja la marca):

```
Warm sunlit doorway of a colonial building in Vedado, Havana, with pastel painted
walls in soft coral and cream, cardboard parcels stacked beside the entrance,
late afternoon golden light, tropical plants, authentic Caribbean architecture,
nostalgic warm color grading, wide composition with empty space on the left,
documentary travel photography, no text, no people --ar 16:9 --style raw
```

## 3. Textura del cierre — `textura-carton.jpg`

Se superpone al degradado en modo `overlay` al 25%: debe ser **plana y sin foco de
atención**, solo grano.

```
Seamless close-up texture of natural kraft cardboard, subtle corrugated fibers and
paper grain, evenly lit with no strong highlights or shadows, flat uniform surface,
warm beige tone, high resolution material texture, no objects, no text --ar 16:9
```

---

## Fotos de producto para el stock

Para el catálogo de `/stock`, lo que mejor funciona son **fotos reales de la mercancía**.
Si necesitas rellenar mientras tanto:

```
Single [PRENDA] photographed on a plain warm cream background, soft even studio
light, subtle drop shadow beneath, centered composition, catalog product
photography, true-to-life colors, sharp focus, no props, no text --ar 1:1
```

Sustituye `[PRENDA]` por el artículo: *white linen summer dress*, *tan leather
crossbody bag*, *white leather sneakers*…

**Consejos para el catálogo:**

- **Cuadradas (1:1)**: la tarjeta recorta a cuadrado, cualquier otra proporción pierde
  bordes.
- **Fondo claro y uniforme**: las tarjetas tienen fondo claro y las fotos con fondo
  oscuro rompen la cuadrícula.
- **El mismo encuadre en todas**: el producto centrado, ocupando un 80% del cuadro.

---

## Logotipos de las tiendas

El muro de tiendas ahora muestra el nombre de cada una con su color corporativo. Para
usar los logotipos reales, coloca los SVG en `public/tiendas/` con estos nombres:

```
amazon.svg   walmart.svg   shein.svg      temu.svg
fashion-nova.svg           ebay.svg       target.svg
best-buy.svg  nike.svg     zara.svg       aliexpress.svg
home-depot.svg             sephora.svg    victorias-secret.svg
```

El componente los detecta solo: si el archivo está, pinta el logotipo; si no, deja el
nombre coloreado. Puedes mezclar ambos sin problema.

> **Antes de hacerlo, ten en cuenta:** son marcas registradas. Usarlas para indicar de
> dónde traes la mercancía es un uso descriptivo razonable, pero conviene que no sugiera
> que esas empresas te patrocinan o están asociadas contigo. Si las pones, añade cerca
> una línea del estilo «Marcas propiedad de sus respectivos titulares. ShellBox no está
> afiliada a ellas». Los generadores de imágenes **no** sirven aquí: inventan logotipos
> deformados. Descárgalos de la sala de prensa de cada marca o de un repositorio de
> logotipos vectoriales.
