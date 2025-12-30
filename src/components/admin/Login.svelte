<script lang="ts">
  import { onMount } from 'svelte';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Guardar token en localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_email', data.user.email);

      // Disparar evento de login exitoso
      if (typeof window !== 'undefined') {
        (window as any).handleLoginSuccess?.(data.token);
      }
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    // Limpiar campos al montar
    email = '';
    password = '';
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm">
    <div class="text-center">
      <h2 class="text-3xl font-semibold text-gray-900">Panel de Administración</h2>
      <p class="mt-2 text-sm text-gray-600">Ingresa tus credenciales para continuar</p>
    </div>

    <form class="mt-8 space-y-6" onsubmit={handleSubmit}>
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            required
            bind:value={email}
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="admin@shellbox.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            bind:value={password}
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  </div>
</div>
