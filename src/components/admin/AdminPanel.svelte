<script lang="ts">
  import { onMount } from 'svelte';
  import type { Product } from '../../lib/productStore';
  import ProductList from './ProductList.svelte';
  import ProductForm from './ProductForm.svelte';

  let products = $state<Product[]>([]);
  let showForm = $state(false);
  let editingProduct = $state<Product | null>(null);
  let notification = $state<{ message: string; type: 'success' | 'error' } | null>(null);
  let loading = $state(true);

  function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async function loadProducts() {
    try {
      loading = true;
      const response = await fetch('/api/products');
      if (response.ok) {
        products = await response.json();
      }
    } catch (error) {
      console.error('Error loading products:', error);
      showNotification('Error al cargar productos', 'error');
    } finally {
      loading = false;
    }
  }

  function showNotification(message: string, type: 'success' | 'error' = 'success') {
    notification = { message, type };
    setTimeout(() => {
      notification = null;
    }, 3000);
  }

  function handleAddNew() {
    editingProduct = null;
    showForm = true;
  }

  function handleEdit(product: Product) {
    editingProduct = product;
    showForm = true;
  }

  async function handleSave(productData: Omit<Product, 'id'>) {
    try {
      if (editingProduct) {
        // Actualizar producto existente
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          const updated = await response.json();
          products = products.map(p => p.id === editingProduct!.id ? updated : p);
          showNotification('Producto actualizado correctamente');
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Error al actualizar');
        }
      } else {
        // Crear nuevo producto
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          const newProduct = await response.json();
          products = [...products, newProduct];
          showNotification('Producto creado correctamente');
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Error al crear');
        }
      }
      showForm = false;
      editingProduct = null;
    } catch (error: any) {
      showNotification(error.message || 'Error al guardar el producto', 'error');
      console.error('Error:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        products = products.filter(p => p.id !== id);
        showNotification('Producto eliminado correctamente');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar');
      }
    } catch (error: any) {
      showNotification(error.message || 'Error al eliminar el producto', 'error');
      console.error('Error:', error);
    }
  }

  function handleCancel() {
    showForm = false;
    editingProduct = null;
  }

  onMount(() => {
    loadProducts();
  });
</script>

<div class="space-y-6">
  <!-- Action Bar -->
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <div class="px-4 py-2 bg-white rounded-xl border border-gray-200">
        <span class="text-sm font-medium text-gray-900">{products.length}</span>
        <span class="text-sm text-gray-500 ml-1">productos</span>
      </div>
    </div>
    <button
      onclick={handleAddNew}
      class="px-5 py-2.5 bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 rounded-xl transition-colors flex items-center space-x-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      <span>Nuevo Producto</span>
    </button>
  </div>

  <!-- Products List -->
  <ProductList
    {products}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />

  <!-- Product Form Modal -->
  {#if showForm}
    <ProductForm
      product={editingProduct}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  {/if}

  <!-- Notification -->
  {#if notification}
    <div class="fixed bottom-8 right-8 z-50 animate-fadeIn">
      <div class="px-6 py-4 rounded-xl shadow-lg {notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center space-x-3">
        {#if notification.type === 'success'}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {/if}
        <span class="font-medium">{notification.message}</span>
      </div>
    </div>
  {/if}
</div>
