<script lang="ts">
  import { CATEGORIAS, urlImagen, type Producto, type ProductoFormulario } from '../../lib/types';

  interface Props {
    producto?: Producto | null;
    onGuardar: (datos: ProductoFormulario) => Promise<void>;
    onCancelar: () => void;
  }

  let { producto = null, onGuardar, onCancelar }: Props = $props();

  let datos = $state<ProductoFormulario>({
    name: producto?.name ?? '',
    price: producto?.price ?? 0,
    description: producto?.description ?? '',
    category: producto?.category ?? CATEGORIAS[0],
    subcategory: producto?.subcategory ?? '',
    sizes: [...(producto?.sizes ?? [])],
    colors: producto?.colors?.map((c) => ({ ...c })) ?? [],
    images: [...(producto?.images ?? [])],
    featured: producto?.featured ?? false,
    new: producto?.new ?? false,
    available: producto?.available ?? true,
  });

  let tallaNueva = $state('');
  let colorNombre = $state('');
  let colorHex = $state('#ee4e34');
  let subiendo = $state(false);
  let guardando = $state(false);
  let error = $state('');
  let entradaArchivos = $state<HTMLInputElement | null>(null);

  function anadirTalla() {
    const talla = tallaNueva.trim();
    if (!talla || datos.sizes.includes(talla)) return;
    datos.sizes = [...datos.sizes, talla];
    tallaNueva = '';
  }

  function anadirColor() {
    const nombre = colorNombre.trim();
    if (!nombre) return;
    datos.colors = [...datos.colors, { name: nombre, hex: colorHex }];
    colorNombre = '';
  }

  async function subirArchivos(lista: FileList | null) {
    if (!lista || lista.length === 0) return;

    if (datos.images.length + lista.length > 8) {
      error = `Máximo 8 imágenes por producto (ya tienes ${datos.images.length}).`;
      return;
    }

    subiendo = true;
    error = '';

    try {
      const cuerpo = new FormData();
      for (const archivo of Array.from(lista)) cuerpo.append('files', archivo);

      const respuesta = await fetch('/api/upload', {
        method: 'POST',
        // Sin Content-Type: el navegador pone el boundary del multipart.
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        body: cuerpo,
      });

      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.error || 'No se pudieron subir las imágenes');

      datos.images = [...datos.images, ...resultado.keys];
    } catch (e: any) {
      error = e.message;
    } finally {
      subiendo = false;
      if (entradaArchivos) entradaArchivos.value = '';
    }
  }

  function moverImagen(desde: number, hacia: number) {
    if (hacia < 0 || hacia >= datos.images.length) return;
    const copia = [...datos.images];
    const [movida] = copia.splice(desde, 1);
    copia.splice(hacia, 0, movida);
    datos.images = copia;
  }

  async function enviar(evento: Event) {
    evento.preventDefault();
    error = '';

    if (!datos.description.trim()) {
      error = 'La descripción es obligatoria.';
      return;
    }

    guardando = true;
    try {
      await onGuardar({ ...datos, price: Number(datos.price) });
    } catch (e: any) {
      error = e.message || 'No se pudo guardar el producto';
    } finally {
      guardando = false;
    }
  }
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && !guardando && onCancelar()} />

<div
  class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:p-8"
  role="presentation"
  onclick={(e) => e.target === e.currentTarget && !guardando && onCancelar()}
>
  <div
    class="card my-auto w-full max-w-2xl overflow-hidden"
    role="dialog"
    aria-modal="true"
    aria-labelledby="titulo-formulario"
  >
    <div
      class="flex items-center justify-between px-6 py-5"
      style="border-bottom: 1px solid var(--border)"
    >
      <h2 id="titulo-formulario" class="text-xl font-bold">
        {producto ? 'Editar producto' : 'Nuevo producto'}
      </h2>
      <button
        onclick={onCancelar}
        class="rounded-lg p-1.5"
        style="color: var(--text-muted)"
        aria-label="Cerrar"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <form onsubmit={enviar} class="max-h-[70vh] space-y-6 overflow-y-auto p-6">
      <!-- Imágenes -->
      <fieldset>
        <legend class="text-sm font-semibold">Imágenes</legend>
        <p class="mt-1 text-xs" style="color: var(--text-faint)">
          La primera es la portada. Arrastra con las flechas para reordenar. Máximo 8, hasta 8 MB
          cada una.
        </p>

        <div class="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {#each datos.images as clave, i (clave)}
            <div
              class="group relative aspect-square overflow-hidden rounded-xl"
              style="background-color: var(--bg-subtle); border: 1px solid var(--border)"
            >
              <img src={urlImagen(clave)} alt={`Imagen ${i + 1}`} class="h-full w-full object-cover" />

              {#if i === 0}
                <span
                  class="bg-gradient-brand absolute top-1 left-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                >
                  Portada
                </span>
              {/if}

              <div
                class="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
              >
                <button
                  type="button"
                  onclick={() => moverImagen(i, i - 1)}
                  disabled={i === 0}
                  class="rounded bg-white/90 p-1 text-gray-900 disabled:opacity-30"
                  aria-label="Mover a la izquierda"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onclick={() => (datos.images = datos.images.filter((_, j) => j !== i))}
                  class="rounded bg-red-500 p-1 text-white"
                  aria-label={`Quitar imagen ${i + 1}`}
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onclick={() => moverImagen(i, i + 1)}
                  disabled={i === datos.images.length - 1}
                  class="rounded bg-white/90 p-1 text-gray-900 disabled:opacity-30"
                  aria-label="Mover a la derecha"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          {/each}

          {#if datos.images.length < 8}
            <button
              type="button"
              onclick={() => entradaArchivos?.click()}
              disabled={subiendo}
              class="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-colors disabled:opacity-50"
              style="border-color: var(--border-strong); color: var(--text-faint)"
            >
              {#if subiendo}
                <svg class="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span class="text-[11px] font-medium">Subiendo…</span>
              {:else}
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span class="text-[11px] font-medium">Añadir</span>
              {/if}
            </button>
          {/if}
        </div>

        <input
          bind:this={entradaArchivos}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          class="hidden"
          onchange={(e) => subirArchivos((e.currentTarget as HTMLInputElement).files)}
        />
      </fieldset>

      <!-- Datos principales -->
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label for="nombre" class="block text-sm font-semibold">Nombre</label>
          <input
            id="nombre"
            type="text"
            bind:value={datos.name}
            required
            maxlength="140"
            class="mt-1.5 w-full rounded-xl px-4 py-2.5 outline-none"
            style="background-color: var(--bg-subtle); border: 1px solid var(--border); color: var(--text)"
            placeholder="Vestido midi de verano"
          />
        </div>

        <div class="sm:col-span-2">
          <label for="descripcion" class="block text-sm font-semibold">
            Descripción <span style="color: var(--color-brand-coral)">*</span>
          </label>
          <textarea
            id="descripcion"
            bind:value={datos.description}
            required
            rows="3"
            maxlength="600"
            class="mt-1.5 w-full resize-y rounded-xl px-4 py-2.5 outline-none"
            style="background-color: var(--bg-subtle); border: 1px solid var(--border); color: var(--text)"
            placeholder="Material, medidas, detalles… Es obligatoria."
          ></textarea>
          <p class="mt-1 text-xs" style="color: var(--text-faint)">
            {datos.description.length}/600
          </p>
        </div>

        <div>
          <label for="precio" class="block text-sm font-semibold">Precio (USD)</label>
          <input
            id="precio"
            type="number"
            bind:value={datos.price}
            required
            step="0.01"
            min="0"
            class="mt-1.5 w-full rounded-xl px-4 py-2.5 outline-none"
            style="background-color: var(--bg-subtle); border: 1px solid var(--border); color: var(--text)"
          />
        </div>

        <div>
          <label for="categoria" class="block text-sm font-semibold">Categoría</label>
          <select
            id="categoria"
            bind:value={datos.category}
            class="mt-1.5 w-full rounded-xl px-4 py-2.5 outline-none"
            style="background-color: var(--bg-subtle); border: 1px solid var(--border); color: var(--text)"
          >
            {#each CATEGORIAS as categoria}
              <option value={categoria}>{categoria}</option>
            {/each}
          </select>
        </div>

        <div class="sm:col-span-2">
          <label for="subcategoria" class="block text-sm font-semibold">
            Subcategoría <span class="font-normal" style="color: var(--text-faint)">(opcional)</span>
          </label>
          <input
            id="subcategoria"
            type="text"
            bind:value={datos.subcategory}
            maxlength="60"
            class="mt-1.5 w-full rounded-xl px-4 py-2.5 outline-none"
            style="background-color: var(--bg-subtle); border: 1px solid var(--border); color: var(--text)"
            placeholder="Vestidos, tenis, bolsos…"
          />
        </div>
      </div>

      <!-- Tallas -->
      <fieldset>
        <legend class="text-sm font-semibold">Tallas</legend>
        <div class="mt-2 flex gap-2">
          <input
            type="text"
            bind:value={tallaNueva}
            onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), anadirTalla())}
            maxlength="12"
            class="flex-1 rounded-xl px-4 py-2 text-sm outline-none"
            style="background-color: var(--bg-subtle); border: 1px solid var(--border); color: var(--text)"
            placeholder="S, M, L, 38…"
          />
          <button type="button" onclick={anadirTalla} class="btn-secondary !px-4 !py-2 text-sm">
            Añadir
          </button>
        </div>

        {#if datos.sizes.length}
          <div class="mt-3 flex flex-wrap gap-2">
            {#each datos.sizes as talla}
              <span
                class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium"
                style="background-color: var(--bg-subtle); border: 1px solid var(--border)"
              >
                {talla}
                <button
                  type="button"
                  onclick={() => (datos.sizes = datos.sizes.filter((t) => t !== talla))}
                  style="color: var(--text-faint)"
                  aria-label={`Quitar talla ${talla}`}
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            {/each}
          </div>
        {/if}
      </fieldset>

      <!-- Colores -->
      <fieldset>
        <legend class="text-sm font-semibold">Colores</legend>
        <div class="mt-2 flex gap-2">
          <input
            type="color"
            bind:value={colorHex}
            class="h-10 w-12 shrink-0 cursor-pointer rounded-lg"
            style="border: 1px solid var(--border); background-color: var(--bg-subtle)"
            aria-label="Elegir color"
          />
          <input
            type="text"
            bind:value={colorNombre}
            onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), anadirColor())}
            maxlength="30"
            class="flex-1 rounded-xl px-4 py-2 text-sm outline-none"
            style="background-color: var(--bg-subtle); border: 1px solid var(--border); color: var(--text)"
            placeholder="Nombre del color: Rojo coral"
          />
          <button type="button" onclick={anadirColor} class="btn-secondary !px-4 !py-2 text-sm">
            Añadir
          </button>
        </div>

        {#if datos.colors.length}
          <div class="mt-3 flex flex-wrap gap-2">
            {#each datos.colors as color, i}
              <span
                class="flex items-center gap-2 rounded-lg px-2.5 py-1 text-sm font-medium"
                style="background-color: var(--bg-subtle); border: 1px solid var(--border)"
              >
                <span
                  class="h-4 w-4 rounded-full"
                  style="background-color: {color.hex}; border: 1px solid var(--border-strong)"
                ></span>
                {color.name}
                <button
                  type="button"
                  onclick={() => (datos.colors = datos.colors.filter((_, j) => j !== i))}
                  style="color: var(--text-faint)"
                  aria-label={`Quitar color ${color.name}`}
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            {/each}
          </div>
        {/if}
      </fieldset>

      <!-- Marcas -->
      <fieldset class="flex flex-wrap gap-x-6 gap-y-3">
        <legend class="mb-2 text-sm font-semibold">Estado</legend>
        {#each [{ campo: 'available', texto: 'Disponible' }, { campo: 'featured', texto: 'Destacado' }, { campo: 'new', texto: 'Nuevo' }] as opcion}
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={datos[opcion.campo as 'available' | 'featured' | 'new']}
              onchange={(e) => {
                const marcado = (e.currentTarget as HTMLInputElement).checked;
                if (opcion.campo === 'available') datos.available = marcado;
                else if (opcion.campo === 'featured') datos.featured = marcado;
                else datos.new = marcado;
              }}
              class="h-4 w-4 rounded"
              style="accent-color: var(--color-brand-coral)"
            />
            {opcion.texto}
          </label>
        {/each}
      </fieldset>

      {#if error}
        <p
          class="rounded-xl px-4 py-3 text-sm"
          style="background-color: color-mix(in srgb, #ef4444 12%, transparent); color: #ef4444"
          role="alert"
        >
          {error}
        </p>
      {/if}
    </form>

    <div
      class="flex items-center justify-end gap-3 px-6 py-4"
      style="border-top: 1px solid var(--border)"
    >
      <button type="button" onclick={onCancelar} disabled={guardando} class="btn-secondary !py-2.5 text-sm">
        Cancelar
      </button>
      <button
        type="button"
        onclick={enviar}
        disabled={guardando || subiendo}
        class="btn-primary !py-2.5 text-sm disabled:opacity-60"
      >
        {guardando ? 'Guardando…' : producto ? 'Guardar cambios' : 'Crear producto'}
      </button>
    </div>
  </div>
</div>
