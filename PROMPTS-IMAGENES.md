# Prompts para generar las imágenes

## Cómo se usa

Cada imagen se pide con **dos bloques pegados en este orden**:

```
[ PROMPT GENÉRICO ]  +  [ PROMPT DE LA IMAGEN ]
```

El genérico es siempre el mismo y fija el estilo de la marca, para que todas las
fotos parezcan de la misma sesión. El segundo bloque describe la escena concreta.
Pégalos seguidos, separados por un espacio, en una sola instrucción.

Los prompts están en inglés porque los generadores lo entienden bastante mejor que
el español, aunque tú les escribas en español el resto del tiempo.

**Sobre el `--ar` del final:** es la proporción de la imagen. En Midjourney va tal
cual. En ChatGPT, Gemini o Firefly bórralo y pide la proporción con palabras
(«formato apaisado 16:9», «formato 3:2»).

---

## PROMPT GENÉRICO

Este bloque va al principio de **todas** las imágenes:

```
Editorial commercial photography for a warm, premium parcel-shipping brand.
Soft directional natural light from one side, long gentle shadows, warm golden
tone. Muted color palette built around amber #F7941D, coral #EE4E34, soft pink
#E5497E and cream #FAF7F5, with occasional teal #3F918F accents. Clean
uncluttered composition with generous negative space. Realistic materials,
authentic and unstaged, shallow depth of field, high resolution, subtle film
grain. No text, no letters, no numbers, no watermarks, no brand logos, no
recognizable faces, no clutter, no harsh flash, no oversaturated colors.
```

---

## 1. Fondo del hero — `hero-cajas.jpg`

Va al **14% de opacidad** detrás del titular, así que tiene que ser muy simple: si
lleva mucho detalle, ensucia la lectura del texto.

```
Overhead flat lay of a few kraft cardboard boxes and paper-wrapped parcels
arranged loosely on a cream surface, one box slightly open showing folded fabric
in soft blush and teal tones, a length of coral ribbon curling across the frame.
Wide empty space across the upper left half of the image. Very calm, minimal and
airy, few objects, lots of breathing room. --ar 3:2 --style raw
```

## 2. Banda ancha — `entrega-vedado.jpg`

Lleva un velo oscuro encima y el texto va a la **izquierda**. Por eso el prompt pide
que el motivo quede a la derecha: si sale centrado, el título se le monta encima.

```
Two hands receiving a small stack of kraft cardboard parcels, photographed from a
low three-quarter angle, warm afternoon light streaming in from the right. The
hands and parcels sit in the right third of the frame; the left half is a softly
blurred warm interior, almost empty. Genuine unposed gesture of handing something
over, cinematic warm grading, terracotta and amber tones. Faces not visible.
--ar 16:9 --style raw
```

## 3. Textura del cierre — `textura-carton.jpg`

Se superpone al degradado de marca en modo *overlay* al 25%. Tiene que ser **plana
y sin ningún punto de atención**: solo material y grano.

```
Seamless flat close-up texture of natural kraft cardboard, fine corrugated fibers
and paper grain filling the entire frame evenly. Completely uniform lighting with
no highlights, no shadows, no vignette and no focal point. Warm beige surface,
macro material study. --ar 16:9
```

---

## Fotos de producto para el stock

Para el catálogo lo que mejor funciona son fotos reales de la mercancía. Si necesitas
rellenar mientras tanto, sustituye `[ARTÍCULO]` por lo que sea (*white linen summer
dress*, *tan leather crossbody bag*, *white leather sneakers*…):

```
A single [ARTÍCULO] centered on a plain cream background, filling about 80% of a
square frame, soft even studio light with a subtle contact shadow beneath.
Straight-on catalog product shot, true-to-life color, sharp throughout, nothing
else in frame. --ar 1:1
```

**Tres reglas para que la cuadrícula del catálogo no se rompa:**

- **Cuadradas (1:1).** La tarjeta recorta a cuadrado y cualquier otra proporción
  pierde los bordes.
- **Fondo claro y uniforme.** Una foto con fondo oscuro rompe la fila entera.
- **Mismo encuadre en todas.** Producto centrado, ocupando siempre más o menos lo
  mismo.

---

## Dónde va cada archivo

Guárdalos en `public/fotos/` con **exactamente** estos nombres. El código ya los
busca: si el archivo está, lo usa; si no, esa zona se dibuja con el degradado de
marca y no se rompe nada.

| Archivo | Dónde sale |
| :------ | :--------- |
| `hero-cajas.jpg` | Fondo del hero, al 14% de opacidad |
| `entrega-vedado.jpg` | Banda ancha entre «Cómo funciona» y «Ventajas» |
| `textura-carton.jpg` | Textura sobre el degradado del cierre |

Antes de subirlas, pásalas a **WebP con calidad 80**: pesan la mitad que un JPEG y
se ven igual. Si la generas en JPEG, renómbrala igualmente a `.jpg` como está en la
tabla, o dime y cambio la extensión en el código.

---

## Logotipos de las tiendas

El muro de tiendas muestra ahora el nombre de cada una con su color corporativo. Para
usar los logotipos reales, deja los SVG en `public/tiendas/` con estos nombres:

```
amazon.svg   walmart.svg     shein.svg       temu.svg
ebay.svg     target.svg      best-buy.svg    nike.svg
zara.svg     aliexpress.svg  home-depot.svg  sephora.svg
fashion-nova.svg             victorias-secret.svg
```

El componente los detecta solo. Si el archivo está, pinta el logotipo; si no, deja el
nombre coloreado. Se pueden mezclar los dos sin problema.

> **No los generes con IA.** Los generadores inventan logotipos deformados que se
> notan a la legua. Descárgalos de la sala de prensa de cada marca o de un
> repositorio de logotipos vectoriales.
>
> **Y ten en cuenta que son marcas registradas.** Usarlas para indicar de dónde traes
> la mercancía es un uso descriptivo razonable, pero no debe sugerir que esas empresas
> te patrocinan. Si las pones, conviene una línea cerca del estilo «Marcas propiedad de
> sus respectivos titulares. ShellBox no está afiliada a ellas».
