<script lang="ts">
  import ProductCard from './ProductCard.svelte';
  import type { Producto } from '../../lib/types';
  import { whatsappLink } from '../../lib/config';

  interface Props {
    productos: Producto[];
  }

  let { productos }: Props = $props();

  let categoria = $state('todas');
  let busqueda = $state('');
  let soloDisponibles = $state(false);

  // Categorías reales del catálogo, no una lista fija: si el admin crea una
  // categoría nueva aparece sola.
  const categorias = $derived([
    'todas',
    ...[...new Set(productos.map((p) => p.category).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, 'es')
    ),
  ]);

  const filtrados = $derived.by(() => {
    const termino = busqueda.trim().toLowerCase();

    return productos.filter((p) => {
      if (categoria !== 'todas' && p.category !== categoria) return false;
      if (soloDisponibles && !p.available) return false;
      if (!termino) return true;

      return (
        p.name?.toLowerCase().includes(termino) ||
        p.description?.toLowerCase().includes(termino) ||
        p.category?.toLowerCase().includes(termino)
      );
    });
  });

  const encargo = whatsappLink(
    '¡Hola ShellBox! No encontré lo que buscaba en el stock, quiero hacer un encargo.'
  );
</script>

<!-- Filtros -->
<div class="sticky top-[4.5rem] z-30 -mx-6 mb-10 px-6 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8"
  style="background-color: color-mix(in srgb, var(--bg) 85%, transparent); border-bottom: 1px solid var(--border)"
>
  <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por categoría">
      {#each categorias as cat}
        <button
          onclick={() => (categoria = cat)}
          class="rounded-lg px-4 py-1.5 text-sm font-semibold transition-all duration-200"
          style={categoria === cat
            ? 'background-image: linear-gradient(100deg, var(--color-brand-amber), var(--color-brand-coral) 50%, var(--color-brand-pink)); color: white;'
            : 'background-color: var(--surface); border: 1px solid var(--border); color: var(--text-muted);'}
          aria-pressed={categoria === cat}
        >
          {cat === 'todas' ? 'Todas' : cat}
        </button>
      {/each}
    </div>

    <div class="flex items-center gap-3">
      <label class="flex cursor-pointer items-center gap-2 text-sm" style="color: var(--text-muted)">
        <input
          type="checkbox"
          bind:checked={soloDisponibles}
          class="h-4 w-4 rounded"
          style="accent-color: var(--color-brand-coral)"
        />
        Solo disponibles
      </label>

      <div class="relative">
        <svg
          class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          style="color: var(--text-faint)"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="search"
          bind:value={busqueda}
          placeholder="Buscar producto…"
          aria-label="Buscar producto"
          class="w-full rounded-xl py-2 pr-4 pl-9 text-sm outline-none lg:w-56"
          style="background-color: var(--surface); border: 1px solid var(--border); color: var(--text)"
        />
      </div>
    </div>
  </div>
</div>

<!-- Resultados -->
{#if filtrados.length > 0}
  <p class="mb-6 text-sm" style="color: var(--text-faint)">
    {filtrados.length}
    {filtrados.length === 1 ? 'producto' : 'productos'}
    {#if categoria !== 'todas' || busqueda || soloDisponibles}
      <button
        onclick={() => {
          categoria = 'todas';
          busqueda = '';
          soloDisponibles = false;
        }}
        class="ml-2 font-semibold underline underline-offset-4"
        style="color: var(--color-brand-coral)"
      >
        Limpiar filtros
      </button>
    {/if}
  </p>

  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each filtrados as producto (producto.id)}
      <ProductCard {producto} />
    {/each}
  </div>
{:else}
  <div class="card px-6 py-20 text-center">
    <div
      class="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
      style="background-color: var(--bg-subtle)"
    >
      <svg
        class="h-9 w-9"
        style="color: var(--text-faint)"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="1.3"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    </div>

    <h3 class="mt-6 text-xl font-bold">
      {productos.length === 0 ? 'Todavía no hay stock en Cuba' : 'Ningún producto coincide'}
    </h3>
    <p class="mx-auto mt-2 max-w-md" style="color: var(--text-muted)">
      {productos.length === 0
        ? 'En cuanto llegue mercancía la verás aquí. Mientras tanto, puedes encargar lo que quieras desde Estados Unidos.'
        : 'Prueba con otra categoría o cambia los términos de búsqueda.'}
    </p>

    <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
      {#if productos.length > 0}
        <button
          onclick={() => {
            categoria = 'todas';
            busqueda = '';
            soloDisponibles = false;
          }}
          class="btn-secondary"
        >
          Limpiar filtros
        </button>
      {/if}
      <a href={encargo} target="_blank" rel="noopener noreferrer" class="btn-primary">
        Hacer un encargo
      </a>
    </div>
  </div>
{/if}
