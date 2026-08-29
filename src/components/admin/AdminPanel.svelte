<script lang="ts">
  import { onMount } from 'svelte';
  import ProductList from './ProductList.svelte';
  import ProductForm from './ProductForm.svelte';
  import type { Producto, ProductoFormulario } from '../../lib/types';

  let productos = $state<Producto[]>([]);
  let cargando = $state(true);
  let mostrarFormulario = $state(false);
  let productoEnEdicion = $state<Producto | null>(null);
  let aviso = $state<{ texto: string; tipo: 'ok' | 'error' } | null>(null);
  let busqueda = $state('');
  let confirmarBorrado = $state<Producto | null>(null);

  const filtrados = $derived.by(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return productos;
    return productos.filter(
      (p) =>
        p.name?.toLowerCase().includes(termino) ||
        p.category?.toLowerCase().includes(termino) ||
        p.id === termino
    );
  });

  const estadisticas = $derived({
    total: productos.length,
    disponibles: productos.filter((p) => p.available).length,
    destacados: productos.filter((p) => p.featured).length,
    sinImagen: productos.filter((p) => !p.images?.length).length,
  });

  function cabeceras() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    };
  }

  function mostrarAviso(texto: string, tipo: 'ok' | 'error' = 'ok') {
    aviso = { texto, tipo };
    setTimeout(() => (aviso = null), 4000);
  }

  /** Un token caducado debe devolver al login, no dejar el panel medio roto. */
  function sesionCaducada() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    window.dispatchEvent(new Event('sesion-caducada'));
  }

  async function cargar() {
    cargando = true;
    try {
      const respuesta = await fetch('/api/products');
      if (!respuesta.ok) throw new Error('No se pudieron cargar los productos');
      productos = await respuesta.json();
    } catch (error: any) {
      mostrarAviso(error.message || 'Error al cargar los productos', 'error');
    } finally {
      cargando = false;
    }
  }

  async function guardar(datos: ProductoFormulario) {
    const editando = productoEnEdicion;
    const respuesta = await fetch(
      editando ? `/api/products/${editando.id}` : '/api/products',
      {
        method: editando ? 'PUT' : 'POST',
        headers: cabeceras(),
        body: JSON.stringify(datos),
      }
    );

    if (respuesta.status === 401 || respuesta.status === 403) {
      sesionCaducada();
      throw new Error('Tu sesión ha caducado. Vuelve a iniciar sesión.');
    }

    const resultado = await respuesta.json();
    if (!respuesta.ok) throw new Error(resultado.error || 'No se pudo guardar');

    productos = editando
      ? productos.map((p) => (p.id === editando.id ? resultado : p))
      : [resultado, ...productos];

    mostrarFormulario = false;
    productoEnEdicion = null;
    mostrarAviso(editando ? 'Producto actualizado' : 'Producto creado');
  }

  async function eliminar(producto: Producto) {
    confirmarBorrado = null;
    try {
      const respuesta = await fetch(`/api/products/${producto.id}`, {
        method: 'DELETE',
        headers: cabeceras(),
      });

      if (respuesta.status === 401 || respuesta.status === 403) {
        sesionCaducada();
        return;
      }

      if (!respuesta.ok) {
        const resultado = await respuesta.json().catch(() => ({}));
        throw new Error(resultado.error || 'No se pudo eliminar');
      }

      productos = productos.filter((p) => p.id !== producto.id);
      mostrarAviso('Producto eliminado');
    } catch (error: any) {
      mostrarAviso(error.message || 'Error al eliminar', 'error');
    }
  }

  onMount(cargar);
</script>

<!-- Resumen -->
<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
  {#each [{ etiqueta: 'Productos', valor: estadisticas.total }, { etiqueta: 'Disponibles', valor: estadisticas.disponibles }, { etiqueta: 'Destacados', valor: estadisticas.destacados }, { etiqueta: 'Sin imagen', valor: estadisticas.sinImagen }] as dato}
    <div class="card p-5">
      <p class="text-xs font-semibold tracking-wider uppercase" style="color: var(--text-faint)">
        {dato.etiqueta}
      </p>
      <p class="mt-1.5 text-3xl font-bold">{cargando ? '—' : dato.valor}</p>
    </div>
  {/each}
</div>

<!-- Barra de acciones -->
<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div class="relative sm:w-72">
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
      placeholder="Buscar por nombre, categoría o referencia…"
      aria-label="Buscar producto"
      class="w-full rounded-xl py-2.5 pr-4 pl-9 text-sm outline-none"
      style="background-color: var(--surface); border: 1px solid var(--border); color: var(--text)"
    />
  </div>

  <div class="flex gap-2">
    <button onclick={cargar} class="btn-secondary !px-4 !py-2.5 text-sm" disabled={cargando}>
      <svg
        class="h-4 w-4 {cargando ? 'animate-spin' : ''}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.023 9.348h4.992V4.356m-4.993 4.992l3.181-3.183a8.25 8.25 0 00-13.803 3.7M4.031 9.865v4.999h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7"
        />
      </svg>
      Actualizar
    </button>

    <button
      onclick={() => {
        productoEnEdicion = null;
        mostrarFormulario = true;
      }}
      class="btn-primary !px-5 !py-2.5 text-sm"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Nuevo producto
    </button>
  </div>
</div>

{#if estadisticas.sinImagen > 0 && !cargando}
  <p
    class="mt-4 rounded-xl px-4 py-3 text-sm"
    style="background-color: color-mix(in srgb, var(--color-brand-amber) 12%, transparent); color: var(--text)"
  >
    Hay {estadisticas.sinImagen}
    {estadisticas.sinImagen === 1 ? 'producto sin imagen' : 'productos sin imagen'}. En la web
    pública se ven con un marcador de posición.
  </p>
{/if}

<div class="mt-6">
  <ProductList
    productos={filtrados}
    {cargando}
    onEditar={(producto) => {
      productoEnEdicion = producto;
      mostrarFormulario = true;
    }}
    onEliminar={(producto) => (confirmarBorrado = producto)}
  />
</div>

{#if mostrarFormulario}
  {#key productoEnEdicion?.id ?? 'nuevo'}
    <ProductForm
      producto={productoEnEdicion}
      onGuardar={guardar}
      onCancelar={() => {
        mostrarFormulario = false;
        productoEnEdicion = null;
      }}
    />
  {/key}
{/if}

<!-- Confirmación de borrado: sustituye al confirm() del navegador. -->
{#if confirmarBorrado}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    role="presentation"
    onclick={(e) => e.target === e.currentTarget && (confirmarBorrado = null)}
  >
    <div class="card w-full max-w-md p-6" role="alertdialog" aria-modal="true" aria-labelledby="titulo-borrado">
      <h2 id="titulo-borrado" class="text-lg font-bold">Eliminar producto</h2>
      <p class="mt-2" style="color: var(--text-muted)">
        Se va a eliminar <strong style="color: var(--text)">{confirmarBorrado.name}</strong> y sus
        imágenes. Esta acción no se puede deshacer.
      </p>
      <div class="mt-6 flex justify-end gap-3">
        <button onclick={() => (confirmarBorrado = null)} class="btn-secondary !py-2.5 text-sm">
          Cancelar
        </button>
        <button
          onclick={() => confirmarBorrado && eliminar(confirmarBorrado)}
          class="rounded-[0.875rem] px-6 py-2.5 text-sm font-semibold text-white transition-colors"
          style="background-color: #ef4444"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
{/if}

{#if aviso}
  <div class="fixed right-6 bottom-6 z-50" role="status" aria-live="polite">
    <div
      class="flex items-center gap-3 rounded-xl px-5 py-3.5 font-medium text-white shadow-xl"
      style="background-color: {aviso.tipo === 'ok' ? '#16a34a' : '#ef4444'}"
    >
      <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.2" aria-hidden="true">
        {#if aviso.tipo === 'ok'}
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        {:else}
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        {/if}
      </svg>
      {aviso.texto}
    </div>
  </div>
{/if}
