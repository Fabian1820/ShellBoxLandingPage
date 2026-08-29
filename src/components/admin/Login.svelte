<script lang="ts">
  interface Props {
    onEntrar: (email: string) => void;
  }

  let { onEntrar }: Props = $props();

  let email = $state('');
  let password = $state('');
  let cargando = $state(false);
  let error = $state('');

  async function enviar(evento: Event) {
    evento.preventDefault();
    cargando = true;
    error = '';

    try {
      const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || 'No se pudo iniciar sesión');

      localStorage.setItem('auth_token', datos.token);
      localStorage.setItem('user_email', datos.user.email);

      // La contraseña no debe quedarse en memoria después de usarla.
      password = '';
      onEntrar(datos.user.email);
    } catch (e: any) {
      error = e.message;
      password = '';
    } finally {
      cargando = false;
    }
  }
</script>

<div class="flex min-h-screen items-center justify-center px-4 py-12">
  <div class="w-full max-w-md">
    <div class="mb-8 text-center">
      <a href="/" class="inline-flex rounded-2xl bg-white p-2.5">
        <img src="/shellboxlogo.jpg" alt="ShellBox Encargos" class="h-12 w-auto" />
      </a>
    </div>

    <div class="card p-8">
      <h1 class="text-2xl font-bold">Panel de administración</h1>
      <p class="mt-1.5 text-sm" style="color: var(--text-muted)">
        Introduce tus credenciales para gestionar el stock.
      </p>

      <form onsubmit={enviar} class="mt-8 space-y-5">
        <div>
          <label for="email" class="block text-sm font-semibold">Email</label>
          <input
            id="email"
            type="email"
            required
            autocomplete="username"
            bind:value={email}
            disabled={cargando}
            class="mt-1.5 w-full rounded-xl px-4 py-3 outline-none disabled:opacity-60"
            style="background-color: var(--bg-subtle); border: 1px solid var(--border); color: var(--text)"
            placeholder="admin@shellbox.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-semibold">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            autocomplete="current-password"
            bind:value={password}
            disabled={cargando}
            class="mt-1.5 w-full rounded-xl px-4 py-3 outline-none disabled:opacity-60"
            style="background-color: var(--bg-subtle); border: 1px solid var(--border); color: var(--text)"
            placeholder="••••••••"
          />
        </div>

        {#if error}
          <p
            class="rounded-xl px-4 py-3 text-sm"
            style="background-color: color-mix(in srgb, #ef4444 12%, transparent); color: #ef4444"
            role="alert"
          >
            {error}
          </p>
        {/if}

        <button type="submit" disabled={cargando} class="btn-primary w-full disabled:opacity-60">
          {#if cargando}
            <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Entrando…
          {:else}
            Iniciar sesión
          {/if}
        </button>
      </form>
    </div>

    <p class="mt-6 text-center text-sm">
      <a href="/" class="font-medium hover:underline underline-offset-4" style="color: var(--text-muted)">
        ← Volver a la web
      </a>
    </p>
  </div>
</div>
