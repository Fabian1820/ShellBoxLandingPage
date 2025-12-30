<script lang="ts">
  import type { Product } from '../../lib/productStore';

  interface Props {
    product?: Product | null;
    onSave: (product: Omit<Product, 'id'>) => void;
    onCancel: () => void;
  }

  let { product = null, onSave, onCancel }: Props = $props();

  let formData = $state({
    name: product?.name || '',
    price: product?.price || 0,
    image: product?.image || '',
    category: product?.category || 'Ropa',
    available: product?.available ?? true,
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    onSave(formData);
  }

  const categories = ['Ropa', 'Calzado', 'Accesorios', 'Deportes', 'Otros'];
</script>

<!-- Modal Overlay -->
<div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick={onCancel}>
  <!-- Modal Content -->
  <div
    class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
    onclick={(e) => e.stopPropagation()}
  >
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-xl font-semibold text-gray-900">
        {product ? 'Editar Producto' : 'Nuevo Producto'}
      </h3>
    </div>

    <!-- Form -->
    <form onsubmit={handleSubmit} class="p-6 space-y-5">
      <!-- Nombre -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Nombre del producto
        </label>
        <input
          type="text"
          id="name"
          bind:value={formData.name}
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="Ej: Vestido de Verano"
        />
      </div>

      <!-- Precio -->
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
          Precio (USD)
        </label>
        <input
          type="number"
          id="price"
          bind:value={formData.price}
          required
          step="0.01"
          min="0"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="0.00"
        />
      </div>

      <!-- Imagen URL -->
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
          URL de la imagen
        </label>
        <input
          type="url"
          id="image"
          bind:value={formData.image}
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="https://..."
        />
        {#if formData.image}
          <img src={formData.image} alt="Preview" class="mt-3 w-full h-32 object-cover rounded-xl" />
        {/if}
      </div>

      <!-- Categoría -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <select
          id="category"
          bind:value={formData.category}
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        >
          {#each categories as cat}
            <option value={cat}>{cat}</option>
          {/each}
        </select>
      </div>

      <!-- Disponibilidad -->
      <div class="flex items-center">
        <input
          type="checkbox"
          id="available"
          bind:checked={formData.available}
          class="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
        />
        <label for="available" class="ml-2 text-sm font-medium text-gray-700">
          Producto disponible
        </label>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onclick={onCancel}
          class="px-5 py-2.5 text-gray-700 font-medium text-sm hover:bg-gray-100 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-5 py-2.5 bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 rounded-xl transition-colors"
        >
          {product ? 'Guardar Cambios' : 'Crear Producto'}
        </button>
      </div>
    </form>
  </div>
</div>
