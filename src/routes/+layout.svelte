<script lang="ts">
  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
    let scrollY = 0;
  let mobileMenuOpen = false;
  
  onMount(() => {
    const handleScroll = () => scrollY = window.scrollY;
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      await goto('/login');
      closeMobileMenu();
    }
  }
</script>

<svelte:window bind:scrollY />

<div class="min-h-screen" data-theme="aqua">  <!-- Navigation -->
  <div class="navbar fixed top-0 left-0 right-0 w-screen z-50 bg-secondary text-secondary-content transition-all duration-300"
       class:shadow-lg={scrollY > 50}>
    <div class="navbar-start flex items-center">
      <!-- Logo -->
      <a href="/" class="btn btn-ghost text-xl normal-case">
        <div class="avatar placeholder">
          <div class="text-primary-content rounded-xl w-8 sm:w-10">
            <span class="text-sm sm:text-lg font-bold">J</span>
          </div>
        </div>
        <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
          Janka
        </span>
      </a>      <!-- Desktop Navigation -->
      <ul class="hidden lg:flex menu menu-horizontal px-1 gap-2">
        <li><a href="#features" class="btn btn-ghost btn-sm">Features</a></li>
        <li><a href="/marketplace" class="btn btn-ghost btn-sm">Marketplace</a></li>
        <li><a href="#pricing" class="btn btn-ghost btn-sm">Pricing</a></li>
        <li><a href="#testimonials" class="btn btn-ghost btn-sm">Reviews</a></li>
        <li><a href="#contact" class="btn btn-ghost btn-sm">Contact</a></li>
      </ul>

      <!-- Mobile Menu -->
      <div class="dropdown lg:hidden">
        <div tabindex="0" role="button" class="btn btn-ghost" on:click={toggleMobileMenu}>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </div>
        {#if mobileMenuOpen}          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-lg bg-base-100 rounded-box w-80">
            <li><a href="#features" on:click={closeMobileMenu}>Features</a></li>
            <li><a href="/marketplace" on:click={closeMobileMenu}>Marketplace</a></li>
            <li><a href="#pricing" on:click={closeMobileMenu}>Pricing</a></li>
            <li><a href="#testimonials" on:click={closeMobileMenu}>Reviews</a></li>
            <li><a href="#contact" on:click={closeMobileMenu}>Contact</a></li>
            {#if !$user}
              <div class="divider"></div>
              <li><a href="/login" class="btn btn-ghost btn-block justify-start" on:click={closeMobileMenu} sveltekit:prefetch>Log In</a></li>
              <li><a href="/signup" class="btn btn-primary btn-block" on:click={closeMobileMenu} sveltekit:prefetch>Sign Up</a></li>
            {/if}
          </ul>
        {/if}
      </div>
    </div>    <!-- Auth Buttons -->
    <div class="navbar-end">      {#if $user}          <div class="dropdown dropdown-end">
          <label 
            tabindex="0"
            class="btn btn-ghost btn-circle avatar cursor-pointer"
          >
            <div class="w-10 rounded-full">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${$user.email}`} alt="avatar" />
            </div>
                    <ul 
            id="user-menu"
            class="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-lg bg-base-100 rounded-box w-52"
          >
            <li><a href="/profile">Profile</a></li>
            <li><a href="/calendar">Calendar</a></li>
            <li><a href="/" on:click|preventDefault={handleLogout}>Logout</a></li>
          </ul>
        </div>
      {:else}
        <div class="hidden lg:flex items-center gap-2">
          <a href="/login" class="btn btn-ghost" sveltekit:prefetch>Log In</a>
          <a href="/signup" class="btn btn-primary" sveltekit:prefetch>Sign Up</a>
        </div>
      {/if}
    </div>
  </div>

  <slot />
</div>
