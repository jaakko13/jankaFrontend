<script lang="ts">
  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
    let scrollY = 0;
  let mobileMenuOpen = false;
  let userDropdownOpen = false;
  
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

  function toggleUserDropdown() {
    userDropdownOpen = !userDropdownOpen;
  }

  function closeUserDropdown() {
    userDropdownOpen = false;
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

<div style="min-height: 100vh; color: #111;">
  <!-- Navigation -->
  <nav style="position: fixed; top: 0; left: 0; right: 0; width: 100vw; z-index: 50; background-color: #FFB9B3; transition: box-shadow 0.3s; box-shadow: {scrollY > 50 ? '0 4px 12px rgba(0,0,0,0.12)' : 'none'}; color: #111;">
    <div style="display: flex; align-items: center; max-width: 1280px; margin: 0 auto; padding: 0 1rem; height: 4rem; color: #111;">
      <!-- Logo -->
      <a href="/" style="display: flex; align-items: center; font-size: 1.25rem; font-weight: 700; text-transform: none; padding: 0.5rem 1rem; color: #111;">
        <div style="margin-right: 0.5rem;">
          <div style="color: #111; background: #fff2; border-radius: 0.75rem; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 1rem; font-weight: 700; color: #111;">J</span>
          </div>
        </div>
        <span style="background: linear-gradient(to right, #a855f7, #f59e42); -webkit-background-clip: text; color: #111; font-weight: 700;">Janka</span>
      </a>
      <!-- Desktop Navigation -->
      <ul style="display: none; gap: 0.5rem; margin-left: 2rem; color: #111;" id="desktop-nav">
        <li style="display: inline-block;"><a href="#features" style="padding: 0.25rem 0.75rem; background: none; border: none; font-size: 1rem; color: #111;">Features</a></li>
        <li style="display: inline-block;"><a href="/marketplace" style="padding: 0.25rem 0.75rem; background: none; border: none; font-size: 1rem; color: #111;">Marketplace</a></li>
        <li style="display: inline-block;"><a href="#pricing" style="padding: 0.25rem 0.75rem; background: none; border: none; font-size: 1rem; color: #111;">Pricing</a></li>
        <li style="display: inline-block;"><a href="#testimonials" style="padding: 0.25rem 0.75rem; background: none; border: none; font-size: 1rem; color: #111;">Reviews</a></li>
        <li style="display: inline-block;"><a href="#contact" style="padding: 0.25rem 0.75rem; background: none; border: none; font-size: 1rem; color: #111;">Contact</a></li>
      </ul>
      <!-- Mobile Menu Button -->
      <div style="margin-left: auto; display: flex; align-items: center; color: #111;">
        <button type="button" aria-label="Open menu" style="background: none; border: none; padding: 0.5rem; color: #111; display: block;" on:click={toggleMobileMenu} id="mobile-menu-btn">
          <svg style="width: 1.5rem; height: 1.5rem; color: #111;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
        <!-- Desktop Auth Buttons -->
        {#if !$user}
          <div style="display: none; align-items: center; gap: 0.5rem; margin-left: 1rem; color: #111;" id="desktop-auth">
            <a href="/login" style="background: none; border: none; padding: 0.5rem 1rem; color: #111;" sveltekit:prefetch>Log In</a>
            <a href="/signup" style="background: #3b82f6; color: #fff; padding: 0.5rem 1rem; border-radius: 0.375rem;" sveltekit:prefetch>Sign Up</a>
          </div>
        {/if}
        <!-- User Dropdown -->
        {#if $user}
          <div style="position: relative; margin-left: 1rem; color: #111;">
            <button tabindex="0" aria-label="User menu" style="background: none; border: none; border-radius: 9999px; cursor: pointer; display: flex; align-items: center; color: #111;" on:click={toggleUserDropdown} on:blur={closeUserDropdown}>
              <div style="width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden;">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${$user.email}`} alt="avatar" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </button>
            {#if userDropdownOpen}
              <ul id="user-menu" style="display: block; margin-top: 0.75rem; z-index: 100; padding: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); background: #fff; border-radius: 0.75rem; width: 13rem; position: absolute; right: 0; top: 100%; color: #111;">
                <li><a href="/profile" style="color: #111;">Profile</a></li>
                <li><a href="/calendar" style="color: #111;">Calendar</a></li>
                <li><a href="/" on:click|preventDefault={handleLogout} style="color: #111;">Logout</a></li>
              </ul>
            {/if}
          </div>
        {/if}
      </div>
    </div>
    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
      <div style="position: fixed; top: 4rem; left: 0; right: 0; background: #fff; z-index: 100; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border-radius: 0 0 0.75rem 0.75rem; padding: 1.5rem; color: #111;">
        <ul style="display: flex; flex-direction: column; gap: 1rem; color: #111;">
          <li><a href="#features" on:click={closeMobileMenu} style="color: #111;">Features</a></li>
          <li><a href="/businessCreate" on:click={closeMobileMenu} style="color: #111;">Register Business</a></li>
          <li><a href="#pricing" on:click={closeMobileMenu} style="color: #111;">Pricing</a></li>
          <li><a href="#testimonials" on:click={closeMobileMenu} style="color: #111;">Reviews</a></li>
          <li><a href="#contact" on:click={closeMobileMenu} style="color: #111;">Contact</a></li>
          {#if !$user}
            <li><a href="/login" on:click={closeMobileMenu} sveltekit:prefetch style="color: #3b82f6;">Log In</a></li>
            <li><a href="/signup" on:click={closeMobileMenu} sveltekit:prefetch style="background: #3b82f6; color: #fff; border-radius: 0.375rem; padding: 0.5rem 0; text-align: center;">Sign Up</a></li>
          {/if}
        </ul>
      </div>
    {/if}
  </nav>
  <main style="padding-top: 4rem; color: #111;">
    <slot />
  </main>
</div>
