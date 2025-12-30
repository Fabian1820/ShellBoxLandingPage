<script lang="ts">
  let isScrolled = $state(false);
  let mobileMenuOpen = $state(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      isScrolled = window.scrollY > 20;
    });
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<header
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled
    ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50'
    : 'bg-transparent'}"
>
  <nav class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <a href="/" class="flex items-center group">
        <img
          src="/shellboxlogo.jpg"
          alt="ShellBox"
          class="h-10 w-auto transition-opacity duration-200 group-hover:opacity-80"
        />
      </a>

      <!-- Desktop Navigation - Más discreto -->
      <div class="hidden md:flex items-center space-x-8">
        <a
          href="/"
          class="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
        >
          Inicio
        </a>
        <a
          href="/stock"
          class="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
        >
          Stock en Cuba
        </a>
        <a
          href="/#como-funciona"
          class="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
        >
          ¿Cómo funciona?
        </a>
        <a
          href="/#contacto"
          class="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
        >
          Contactar
        </a>
      </div>

      <!-- Mobile menu button -->
      <button
        onclick={toggleMobileMenu}
        class="md:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          class="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5"
        >
          {#if mobileMenuOpen}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          {/if}
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation -->
    {#if mobileMenuOpen}
      <div class="md:hidden pb-4 animate-fadeIn border-t border-gray-100 mt-2 pt-4">
        <div class="flex flex-col space-y-3">
          <a
            href="/"
            class="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium text-sm px-2 py-2"
          >
            Inicio
          </a>
          <a
            href="/stock"
            class="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium text-sm px-2 py-2"
          >
            Stock en Cuba
          </a>
          <a
            href="/#como-funciona"
            class="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium text-sm px-2 py-2"
          >
            ¿Cómo funciona?
          </a>
          <a
            href="/#contacto"
            class="px-5 py-2 bg-orange-500 text-white rounded-lg transition-colors duration-200 text-sm font-medium text-center mt-2"
          >
            Contactar
          </a>
        </div>
      </div>
    {/if}
  </nav>
</header>
