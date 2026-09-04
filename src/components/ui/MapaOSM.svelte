<script lang="ts">
  import { onMount } from 'svelte';
  import { ENTREGA } from '../../lib/config';

  /**
   * Mapa real de OpenStreetMap con el punto de recogida marcado.
   *
   * Leaflet pesa unos 150 KB y accede a `window` nada más importarse, así que
   * se carga con un import dinámico. Sumado a `client:visible` en la página,
   * su código no se ejecuta en el servidor, no entra en el paquete inicial de
   * la portada y solo se descarga cuando el lector llega hasta aquí.
   * Importante para quien entra con datos móviles.
   */
  const { lat, lng, zoom, etiqueta, aproximado } = ENTREGA.mapa;

  /**
   * `espera`   → aún no toca cargar; se enseña un panel estático con enlace.
   * `cargando` → Leaflet se está descargando.
   * `listo`    → mapa dibujado.
   * `error`    → no se pudo; queda el enlace a OpenStreetMap.
   */
  type Fase = 'espera' | 'cargando' | 'listo' | 'error';

  let contenedor = $state<HTMLDivElement | null>(null);
  let fase = $state<Fase>('espera');
  let zoomLibre = $state(false);

  /** Instancia de Leaflet, guardada para poder alternar el zoom con la rueda. */
  let mapa: any = null;
  let observadorTamano: ResizeObserver | null = null;

  const enlaceExterno = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;

  async function iniciar() {
    if (!contenedor || fase !== 'espera') return;
    fase = 'cargando';

    try {
      const [{ default: L }] = await Promise.all([
        import('leaflet'),
        import('leaflet/dist/leaflet.css'),
      ]);

      // El componente puede haberse destruido mientras se descargaba Leaflet.
      if (!contenedor) return;

      mapa = L.map(contenedor, {
        center: [lat, lng],
        zoom,
        // La rueda del ratón se deja fuera: si no, al bajar por la página el
        // mapa se traga el scroll. Se activa con un botón.
        scrollWheelZoom: false,
        // En móvil se necesitan dos dedos, por el mismo motivo.
        dragging: !L.Browser.mobile,
        attributionControl: true,
        // Leaflet funde las teselas con requestAnimationFrame, que el navegador
        // suspende mientras la pestaña no se pinta: si eso pasa a mitad del
        // fundido, las teselas se quedan translúcidas. Sin fundido aparecen
        // opacas de golpe y no hay estado intermedio que se pueda atascar.
        fadeAnimation: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa);

      // Marcador propio con los colores de la marca, en vez del icono azul de
      // Leaflet (que además necesita imágenes externas).
      const icono = L.divIcon({
        className: 'marcador-shellbox',
        html: `
          <span class="pulso"></span>
          <span class="pin">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" fill="currentColor"/>
              <circle cx="12" cy="10" r="2.6" fill="#fff"/>
            </svg>
          </span>`,
        iconSize: [40, 40],
        iconAnchor: [20, 36],
        popupAnchor: [0, -34],
      });

      L.marker([lat, lng], { icon: icono, title: etiqueta })
        .addTo(mapa)
        .bindPopup(
          `<strong>${etiqueta}</strong>${aproximado ? '<br><em>Ubicación aproximada</em>' : ''}`
        );

      fase = 'listo';

      // Leaflet fija el tamaño al crearse. Si el contenedor cambia después
      // (una columna que se reordena, el móvil al girar, una fuente que
      // termina de cargar) quedan franjas sin teselas hasta que se le avisa.
      mapa.invalidateSize();

      if ('ResizeObserver' in window) {
        observadorTamano = new ResizeObserver(() => mapa?.invalidateSize());
        observadorTamano.observe(contenedor);
      }
    } catch (e) {
      console.error('No se pudo cargar el mapa:', e);
      fase = 'error';
    }
  }

  function alternarZoom() {
    if (!mapa) return;
    zoomLibre = !zoomLibre;
    if (zoomLibre) {
      mapa.scrollWheelZoom.enable();
      mapa.dragging.enable();
    } else {
      mapa.scrollWheelZoom.disable();
    }
  }

  onMount(() => {
    if (!contenedor) return;

    // Leaflet son 146 KB: no se piden hasta que el lector llega hasta aquí.
    // Pero si la detección falla, el usuario se queda mirando un panel muerto,
    // así que hay tres caminos y basta con que funcione uno.
    let observador: IntersectionObserver | null = null;
    let programado = false;

    function estaCerca() {
      if (!contenedor) return false;
      const alto = window.innerHeight || document.documentElement.clientHeight;
      // Sin altura fiable no se puede decidir: se carga y punto.
      if (!alto) return true;
      const r = contenedor.getBoundingClientRect();
      return r.top < alto + 300 && r.bottom > -300;
    }

    function comprobar() {
      programado = false;
      if (fase !== 'espera') return desconectar();
      if (estaCerca()) {
        desconectar();
        iniciar();
      }
    }

    function alDesplazar() {
      if (programado) return;
      programado = true;
      // setTimeout y no requestAnimationFrame: rAF se suspende justo cuando
      // este respaldo tiene que actuar.
      setTimeout(comprobar, 80);
    }

    function desconectar() {
      observador?.disconnect();
      observador = null;
      window.removeEventListener('scroll', alDesplazar);
      window.removeEventListener('resize', alDesplazar);
    }

    if ('IntersectionObserver' in window) {
      observador = new IntersectionObserver(
        (entradas) => {
          if (entradas.some((e) => e.isIntersecting)) {
            desconectar();
            iniciar();
          }
        },
        { rootMargin: '300px' }
      );
      observador.observe(contenedor);
    }

    window.addEventListener('scroll', alDesplazar, { passive: true });
    window.addEventListener('resize', alDesplazar, { passive: true });
    comprobar();

    // Red de seguridad: si a los 6 segundos nada lo ha disparado, se carga
    // igualmente. Es preferible gastar los 146 KB a dejar un panel inerte.
    const respaldo = setTimeout(() => {
      if (fase === 'espera') {
        desconectar();
        iniciar();
      }
    }, 6000);

    return () => {
      clearTimeout(respaldo);
      desconectar();
      observadorTamano?.disconnect();
      mapa?.remove();
      mapa = null;
    };
  });
</script>

<div class="envoltorio">
  <div bind:this={contenedor} class="lienzo" role="application" aria-label={etiqueta}></div>

  {#if fase === 'espera' || fase === 'cargando'}
    <!-- Panel previo: nunca un spinner a secas, siempre con la salida a
         OpenStreetMap por si el mapa no llegara a cargar. -->
    <div class="estado" aria-live="polite">
      <svg class="icono-lugar" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z"
          stroke="currentColor"
          stroke-width="1.6"
        />
        <circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.6" />
      </svg>
      <p class="titulo-estado">{ENTREGA.lugar}</p>
      <p class="pie-estado">
        {fase === 'cargando' ? 'Cargando el mapa…' : 'Punto de recogida'}
      </p>
      <a href={enlaceExterno} target="_blank" rel="noopener noreferrer" class="enlace">
        Ver en OpenStreetMap
      </a>
    </div>
  {/if}

  {#if fase === 'error'}
    <div class="estado">
      <p class="titulo-estado">No se pudo cargar el mapa</p>
      <p class="pie-estado">{ENTREGA.lugar}</p>
      <a href={enlaceExterno} target="_blank" rel="noopener noreferrer" class="enlace">
        Ver en OpenStreetMap
      </a>
    </div>
  {/if}

  {#if fase === 'listo'}
    <!-- Control del zoom con la rueda, para no secuestrar el scroll de la página. -->
    <button class="boton-zoom" onclick={alternarZoom} type="button">
      {zoomLibre ? 'Bloquear zoom' : 'Activar zoom'}
    </button>

    <a href={enlaceExterno} target="_blank" rel="noopener noreferrer" class="boton-abrir">
      Abrir en OpenStreetMap
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H18v4.5M18 6l-7.5 7.5M15 18H6V9" />
      </svg>
    </a>
  {/if}
</div>

<style>
  .envoltorio {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 22rem;
    background-color: var(--bg-subtle);
    overflow: hidden;
  }

  .lienzo {
    width: 100%;
    height: 100%;
    min-height: 22rem;
    z-index: 0;
  }

  /* El mapa de OSM es claro. En modo oscuro se invierte y se recoloca el tono
     para que encaje con la paleta sin necesitar otro proveedor de teselas. */
  :global(.dark) .lienzo :global(.leaflet-tile-pane) {
    filter: invert(1) hue-rotate(190deg) brightness(1.18) contrast(0.78) saturate(0.45);
  }

  /* `.lienzo` ES el contenedor de Leaflet: sus clases se añaden al mismo
     elemento, así que el fondo va aquí y no en un descendiente. El gris claro
     por defecto de Leaflet se vería en los bordes mientras cargan las teselas. */
  .lienzo {
    background: #e8e2e0;
  }

  :global(.dark) .lienzo {
    background: #16181d;
  }

  .estado {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background-color: var(--bg-subtle);
    color: var(--text-muted);
    font-size: 0.875rem;
    z-index: 500;
  }

  .titulo-estado {
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text);
  }

  .pie-estado {
    font-size: 0.8rem;
    color: var(--text-faint);
    margin-top: -0.4rem;
  }

  .icono-lugar {
    width: 2.25rem;
    height: 2.25rem;
    color: var(--color-brand-coral);
  }

  .enlace {
    color: var(--color-brand-coral);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .boton-zoom,
  .boton-abrir {
    position: absolute;
    bottom: 0.75rem;
    z-index: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border-radius: 0.6rem;
    padding: 0.4rem 0.7rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text);
    background-color: color-mix(in srgb, var(--surface) 92%, transparent);
    border: 1px solid var(--border);
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .boton-zoom {
    left: 0.75rem;
  }

  .boton-abrir {
    right: 0.75rem;
    text-decoration: none;
  }

  .boton-zoom:hover,
  .boton-abrir:hover {
    border-color: var(--color-brand-coral);
  }

  .boton-abrir svg {
    width: 0.85rem;
    height: 0.85rem;
  }

  /* ---------- Marcador ---------- */
  :global(.marcador-shellbox) {
    display: grid;
    place-items: center;
  }

  :global(.marcador-shellbox .pin) {
    position: relative;
    display: block;
    width: 2.5rem;
    height: 2.5rem;
    color: var(--color-brand-coral);
    filter: drop-shadow(0 3px 5px rgb(0 0 0 / 0.35));
    /* Sin fill-mode a propósito: el estado base ya es el definitivo, así que
       si la animación no llega a ejecutarse el pin se ve igualmente. */
    animation: caer-pin 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  :global(.marcador-shellbox .pin svg) {
    width: 100%;
    height: 100%;
  }

  @keyframes caer-pin {
    from {
      transform: translateY(-14px) scale(0.7);
      opacity: 0;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }

  /* Onda que se expande bajo el pin, para que el punto se localice de un vistazo. */
  :global(.marcador-shellbox .pulso) {
    position: absolute;
    bottom: 0.15rem;
    left: 50%;
    width: 1rem;
    height: 1rem;
    margin-left: -0.5rem;
    border-radius: 9999px;
    background-color: var(--color-brand-coral);
    opacity: 0.5;
    animation: expandir-pulso 2.4s ease-out infinite;
  }

  @keyframes expandir-pulso {
    0% {
      transform: scale(0.4);
      opacity: 0.55;
    }
    100% {
      transform: scale(2.6);
      opacity: 0;
    }
  }

  /* La atribución de OSM es obligatoria; solo se adapta al tema. */
  :global(.leaflet-control-attribution) {
    background: color-mix(in srgb, var(--surface) 88%, transparent) !important;
    color: var(--text-faint) !important;
    font-size: 0.65rem !important;
  }

  :global(.leaflet-control-attribution a) {
    color: var(--text-muted) !important;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.marcador-shellbox .pin),
    :global(.marcador-shellbox .pulso) {
      animation: none;
    }

    :global(.marcador-shellbox .pulso) {
      opacity: 0.3;
    }
  }
</style>
