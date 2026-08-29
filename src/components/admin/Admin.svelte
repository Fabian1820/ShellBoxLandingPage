<script lang="ts">
  import { onMount } from 'svelte';
  import Login from './Login.svelte';
  import AdminPanel from './AdminPanel.svelte';

  /**
   * Punto de entrada del panel.
   *
   * Antes el estado de sesión se manejaba desde un `<script>` de la página que
   * alternaba `display: none` sobre dos divs y se comunicaba con el componente
   * de login a través de una función global en `window`. Aquí todo vive en un
   * único componente con un estado explícito.
   */
  type Estado = 'verificando' | 'invitado' | 'dentro';

  let estado = $state<Estado>('verificando');
  let email = $state('');
  let oscuro = $state(false);

  async function verificarSesion() {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      estado = 'invitado';
      return;
    }

    try {
      const respuesta = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!respuesta.ok) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        estado = 'invitado';
        return;
      }

      const datos = await respuesta.json();
      email = datos.user.email;
      estado = 'dentro';
    } catch {
      // Fallo de red: no se borra el token, solo se pide entrar de nuevo.
      estado = 'invitado';
    }
  }

  function salir() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    email = '';
    estado = 'invitado';
  }

  function alternarTema() {
    oscuro = !oscuro;
    document.documentElement.classList.toggle('dark', oscuro);
    try {
      localStorage.setItem('theme', oscuro ? 'dark' : 'light');
    } catch {
      /* Sin almacenamiento el tema dura solo esta visita. */
    }
  }

  onMount(() => {
    oscuro = document.documentElement.classList.contains('dark');
    verificarSesion();

    // El panel avisa cuando la API responde 401/403 con un token caducado.
    const alCaducar = () => salir();
    window.addEventListener('sesion-caducada', alCaducar);
    return () => window.removeEventListener('sesion-caducada', alCaducar);
  });
</script>

{#if estado === 'verificando'}
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <svg
        class="mx-auto h-8 w-8 animate-spin"
        style="color: var(--color-brand-coral)"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p class="mt-4 text-sm" style="color: var(--text-muted)">Comprobando tu sesión…</p>
    </div>
  </div>
{:else if estado === 'invitado'}
  <Login
    onEntrar={(correo) => {
      email = correo;
      estado = 'dentro';
    }}
  />
{:else}
  <header
    class="sticky top-0 z-40 backdrop-blur-xl"
    style="background-color: color-mix(in srgb, var(--bg) 85%, transparent); border-bottom: 1px solid var(--border)"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
      <div class="flex items-center gap-3">
        <span class="inline-flex rounded-lg bg-white p-1">
          <img src="/shellboxlogo.jpg" alt="" class="h-7 w-auto" />
        </span>
        <span
          class="rounded-md px-2 py-0.5 text-xs font-bold tracking-wider uppercase"
          style="background-color: var(--bg-subtle); color: var(--text-muted)"
        >
          Admin
        </span>
      </div>

      <div class="flex items-center gap-1 sm:gap-3">
        <span class="hidden text-sm sm:inline" style="color: var(--text-muted)">{email}</span>

        <button
          onclick={alternarTema}
          class="rounded-lg p-2"
          style="color: var(--text-muted)"
          aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {#if oscuro}
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          {:else}
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          {/if}
        </button>

        <a
          href="/stock"
          target="_blank"
          rel="noopener"
          class="hidden rounded-lg px-3 py-2 text-sm font-medium sm:inline"
          style="color: var(--text-muted)"
        >
          Ver la web
        </a>

        <button onclick={salir} class="btn-secondary !px-4 !py-2 text-sm">Cerrar sesión</button>
      </div>
    </div>
  </header>

  <main class="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Gestión de productos</h1>
      <p class="mt-1.5" style="color: var(--text-muted)">
        Lo que publiques aquí es lo que se ve en
        <a href="/stock" class="font-medium underline underline-offset-4" style="color: var(--color-brand-coral)">
          Stock en Cuba</a
        >.
      </p>
    </div>

    <AdminPanel />
  </main>
{/if}
