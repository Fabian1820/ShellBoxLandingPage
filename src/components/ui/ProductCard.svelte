<script lang="ts">
  import { urlImagen, type Producto } from '../../lib/types';
  import { whatsappLink } from '../../lib/config';

  interface Props {
    producto: Producto;
  }

  let { producto }: Props = $props();

  let indiceImagen = $state(0);
  // Claves que el bucket no sirve (404). Un producto puede referenciar una
  // imagen que se borró: en ese caso se enseña el marcador de posición.
  let rotas = $state<Set<string>>(new Set());

  const imagenes = $derived((producto.images ?? []).filter((clave) => !rotas.has(clave)));
  // El índice se acota: al descartar una imagen rota puede quedar fuera de rango.
  const claveActual = $derived(imagenes[Math.min(indiceImagen, imagenes.length - 1)]);
  const imagenActual = $derived(urlImagen(claveActual));

  const consulta = $derived(
    whatsappLink(
      `¡Hola ShellBox! Me interesa este producto del stock en Cuba: ${producto.name} (ref. ${producto.id}) — $${producto.price}`
    )
  );

  const precio = $derived(
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(producto.price)
  );
</script>

<article class="card card-hover group flex h-full flex-col overflow-hidden">
  <div class="relative aspect-square overflow-hidden" style="background-color: var(--bg-subtle)">
    {#if imagenActual}
      <img
        src={imagenActual}
        alt={producto.name}
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        onerror={() => {
          if (claveActual) rotas = new Set([...rotas, claveActual]);
          indiceImagen = 0;
        }}
      />
    {:else}
      <!-- Sin imagen: un marcador de posición en vez de un icono roto. -->
      <div class="flex h-full w-full items-center justify-center" style="color: var(--text-faint)">
        <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
    {/if}

    <!-- Etiquetas -->
    <div class="absolute top-3 left-3 flex flex-col gap-1.5">
      {#if producto.new}
        <span class="bg-gradient-brand rounded-lg px-2.5 py-1 text-xs font-bold text-white">
          Nuevo
        </span>
      {/if}
      {#if producto.featured}
        <span
          class="rounded-lg px-2.5 py-1 text-xs font-bold text-white"
          style="background-color: var(--color-brand-teal)"
        >
          Destacado
        </span>
      {/if}
    </div>

    <span
      class="absolute top-3 right-3 rounded-lg px-2.5 py-1 text-xs font-semibold backdrop-blur-md"
      style="background-color: color-mix(in srgb, var(--surface) 85%, transparent); color: var(--text-muted)"
    >
      {producto.category}
    </span>

    {#if !producto.available}
      <div class="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
        <span class="rounded-lg bg-white/95 px-3 py-1.5 text-sm font-semibold text-gray-900">
          No disponible
        </span>
      </div>
    {/if}

    <!-- Miniaturas cuando hay más de una imagen -->
    {#if imagenes.length > 1}
      <div class="absolute right-3 bottom-3 left-3 flex justify-center gap-1.5">
        {#each imagenes as _, i}
          <button
            onclick={() => (indiceImagen = i)}
            class="h-1.5 rounded-full transition-all duration-300"
            style="width: {i === indiceImagen ? '1.5rem' : '0.375rem'}; background-color: {i ===
            indiceImagen
              ? 'white'
              : 'rgba(255,255,255,0.55)'}"
            aria-label={`Ver imagen ${i + 1} de ${imagenes.length}`}
          ></button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="flex flex-1 flex-col p-5">
    <h3 class="line-clamp-2 font-semibold" title={producto.name}>{producto.name}</h3>

    {#if producto.description}
      <p class="mt-1.5 line-clamp-2 text-sm" style="color: var(--text-muted)">
        {producto.description}
      </p>
    {/if}

    {#if producto.sizes?.length}
      <div class="mt-3 flex flex-wrap gap-1">
        {#each producto.sizes.slice(0, 5) as talla}
          <span
            class="rounded-md px-2 py-0.5 text-xs font-medium"
            style="background-color: var(--bg-subtle); color: var(--text-muted)"
          >
            {talla}
          </span>
        {/each}
        {#if producto.sizes.length > 5}
          <span class="px-1 text-xs" style="color: var(--text-faint)">
            +{producto.sizes.length - 5}
          </span>
        {/if}
      </div>
    {/if}

    <p class="mt-4 text-2xl font-bold">{precio}</p>

    <div class="flex-1"></div>

    {#if producto.available}
      <a
        href={consulta}
        target="_blank"
        rel="noopener noreferrer"
        class="btn-primary mt-4 w-full !py-2.5 text-sm"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
          ></path>
        </svg>
        Consultar
      </a>
    {:else}
      <button
        disabled
        class="mt-4 w-full cursor-not-allowed rounded-[0.875rem] py-2.5 text-sm font-semibold"
        style="background-color: var(--bg-subtle); color: var(--text-faint)"
      >
        No disponible
      </button>
    {/if}
  </div>
</article>
