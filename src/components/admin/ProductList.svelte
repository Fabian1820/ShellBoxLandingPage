<script lang="ts">
  import { imagenPrincipal, type Producto } from '../../lib/types';

  interface Props {
    productos: Producto[];
    cargando: boolean;
    onEditar: (producto: Producto) => void;
    onEliminar: (producto: Producto) => void;
  }

  let { productos, cargando, onEditar, onEliminar }: Props = $props();

  // Un producto puede apuntar a una imagen que ya no está en el bucket.
  let rotas = $state<Set<string>>(new Set());

  function miniatura(producto: Producto): string {
    const clave = producto.images?.[0];
    return clave && !rotas.has(clave) ? imagenPrincipal(producto) : '';
  }

  function marcarRota(producto: Producto) {
    const clave = producto.images?.[0];
    if (clave) rotas = new Set([...rotas, clave]);
  }

  function precio(valor: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(valor);
  }
</script>

<div class="card overflow-hidden">
  {#if cargando}
    <!-- Esqueleto de carga en vez de una tabla vacía que parece "sin productos". -->
    <div class="divide-y" style="border-color: var(--border)">
      {#each Array(3) as _}
        <div class="flex items-center gap-4 p-4">
          <div class="h-14 w-14 shrink-0 animate-pulse rounded-lg" style="background-color: var(--bg-subtle)"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3.5 w-1/3 animate-pulse rounded" style="background-color: var(--bg-subtle)"></div>
            <div class="h-3 w-1/5 animate-pulse rounded" style="background-color: var(--bg-subtle)"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if productos.length === 0}
    <div class="px-6 py-16 text-center">
      <svg
        class="mx-auto h-12 w-12"
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
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m16.5 0H3.375c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125z"
        />
      </svg>
      <p class="mt-4 font-semibold">Todavía no hay productos</p>
      <p class="mt-1 text-sm" style="color: var(--text-muted)">
        Crea el primero con el botón «Nuevo producto».
      </p>
    </div>
  {:else}
    <!-- Tabla en escritorio -->
    <div class="hidden overflow-x-auto md:block">
      <table class="w-full">
        <thead style="background-color: var(--bg-subtle)">
          <tr>
            {#each ['Producto', 'Categoría', 'Precio', 'Estado'] as encabezado}
              <th
                class="px-5 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                style="color: var(--text-faint)"
              >
                {encabezado}
              </th>
            {/each}
            <th class="px-5 py-3 text-right text-xs font-semibold tracking-wider uppercase" style="color: var(--text-faint)">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y" style="border-color: var(--border)">
          {#each productos as producto (producto.id)}
            <tr class="transition-colors hover:bg-[var(--bg-subtle)]">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  {#if miniatura(producto)}
                    <img
                      src={miniatura(producto)}
                      alt=""
                      class="h-12 w-12 shrink-0 rounded-lg object-cover"
                      style="background-color: var(--bg-subtle)"
                      loading="lazy"
                      onerror={() => marcarRota(producto)}
                    />
                  {:else}
                    <div
                      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                      style="background-color: var(--bg-subtle); color: var(--text-faint)"
                      title="Sin imagen o imagen no encontrada"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                        />
                      </svg>
                    </div>
                  {/if}
                  <div class="min-w-0">
                    <p class="truncate font-medium">{producto.name}</p>
                    <p class="text-xs" style="color: var(--text-faint)">
                      ref. {producto.id}
                      {#if producto.images?.length > 1}
                        · {producto.images.length} imágenes
                      {/if}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-sm" style="color: var(--text-muted)">
                {producto.category}{producto.subcategory ? ` · ${producto.subcategory}` : ''}
              </td>
              <td class="px-5 py-3.5 font-semibold">{precio(producto.price)}</td>
              <td class="px-5 py-3.5">
                <div class="flex flex-wrap gap-1.5">
                  <span
                    class="rounded-md px-2 py-0.5 text-xs font-semibold"
                    style={producto.available
                      ? 'background-color: color-mix(in srgb, #16a34a 15%, transparent); color: #16a34a'
                      : 'background-color: color-mix(in srgb, #ef4444 15%, transparent); color: #ef4444'}
                  >
                    {producto.available ? 'Disponible' : 'Agotado'}
                  </span>
                  {#if producto.featured}
                    <span
                      class="rounded-md px-2 py-0.5 text-xs font-semibold"
                      style="background-color: color-mix(in srgb, var(--color-brand-teal) 18%, transparent); color: var(--color-brand-teal)"
                    >
                      Destacado
                    </span>
                  {/if}
                  {#if producto.new}
                    <span
                      class="rounded-md px-2 py-0.5 text-xs font-semibold"
                      style="background-color: color-mix(in srgb, var(--color-brand-coral) 18%, transparent); color: var(--color-brand-coral)"
                    >
                      Nuevo
                    </span>
                  {/if}
                </div>
              </td>
              <td class="px-5 py-3.5 text-right whitespace-nowrap">
                <button
                  onclick={() => onEditar(producto)}
                  class="mr-3 text-sm font-semibold"
                  style="color: var(--color-brand-coral)"
                >
                  Editar
                </button>
                <button onclick={() => onEliminar(producto)} class="text-sm font-semibold" style="color: #ef4444">
                  Eliminar
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Tarjetas en móvil: una tabla de 5 columnas no cabe en un teléfono. -->
    <div class="divide-y md:hidden" style="border-color: var(--border)">
      {#each productos as producto (producto.id)}
        <div class="flex gap-3 p-4">
          {#if miniatura(producto)}
            <img
              src={miniatura(producto)}
              alt=""
              class="h-16 w-16 shrink-0 rounded-lg object-cover"
              style="background-color: var(--bg-subtle)"
              loading="lazy"
              onerror={() => marcarRota(producto)}
            />
          {:else}
            <div class="h-16 w-16 shrink-0 rounded-lg" style="background-color: var(--bg-subtle)"></div>
          {/if}

          <div class="min-w-0 flex-1">
            <p class="truncate font-medium">{producto.name}</p>
            <p class="text-sm font-semibold">{precio(producto.price)}</p>
            <p class="text-xs" style="color: var(--text-faint)">
              {producto.category} · ref. {producto.id} · {producto.available ? 'Disponible' : 'Agotado'}
            </p>
            <div class="mt-2 flex gap-4">
              <button onclick={() => onEditar(producto)} class="text-sm font-semibold" style="color: var(--color-brand-coral)">
                Editar
              </button>
              <button onclick={() => onEliminar(producto)} class="text-sm font-semibold" style="color: #ef4444">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
