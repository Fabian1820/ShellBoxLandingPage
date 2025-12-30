<script lang="ts">
  import type { Product } from '../../lib/productStore';

  interface Props {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
  }

  let { products, onEdit, onDelete }: Props = $props();
</script>

<div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
  <!-- Header -->
  <div class="px-6 py-4 border-b border-gray-200">
    <h3 class="text-lg font-semibold text-gray-900">Productos</h3>
    <p class="text-sm text-gray-500 font-light mt-1">{products.length} productos en total</p>
  </div>

  <!-- Table -->
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        {#each products as product (product.id)}
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {product.id}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img src={product.image} alt={product.name} class="w-10 h-10 rounded-lg object-cover" />
                <span class="ml-3 text-sm font-medium text-gray-900">{product.name}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {product.category}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              ${product.price.toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium rounded-full {product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                {product.available ? 'Disponible' : 'No disponible'}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onclick={() => onEdit(product)}
                class="text-orange-500 hover:text-orange-600 mr-3 transition-colors"
              >
                Editar
              </button>
              <button
                onclick={() => onDelete(product.id)}
                class="text-red-500 hover:text-red-600 transition-colors"
              >
                Eliminar
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if products.length === 0}
    <div class="px-6 py-12 text-center">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="text-gray-500 font-light">No hay productos</p>
    </div>
  {/if}
</div>
