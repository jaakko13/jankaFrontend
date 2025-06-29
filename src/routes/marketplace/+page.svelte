<script>
  import { onMount } from 'svelte';
  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  
  let scrollY = 0;
  let mobileMenuOpen = false;
  
  onMount(() => {
    const handleScroll = () => scrollY = window.scrollY;
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

<div style="background-color: #B3D6FF; min-height: 100vh;">
  <!-- Top Centered Heading -->
  <div style="width: 100%; text-align: center; max-width: 56rem; margin: 0 auto; padding-top: 2.5rem;">
    <h1 style="font-size: 2.25rem; font-weight: 700; line-height: 1.2;">
      <span style="color: var(--tw-prose-invert);">Live Better</span>
    </h1>
    <p style="font-size: 1.25rem; margin-bottom: 2rem; line-height: 1.6; opacity: 0.8; padding-left: 1rem; padding-right: 1rem;">
      Transform your appointment booking experience with AI-powered scheduling that works seamlessly for both you and your clients.
    </p>
  </div>

 

  <!-- Footer -->
  <footer style="text-align: center; padding: 2.5rem; color: #111;">
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; max-width: 80rem; margin: 0 auto; color: #111;">
      <!-- Company Info -->
      <div style="text-align: left; color: #111; width: 100%; max-width: 28rem;">
        <div style="display: flex; align-items: center; margin-bottom: 1.5rem; color: #111;">
          <div style="margin-right: 0.75rem;">
            <div style="background: linear-gradient(to bottom right, var(--tw-gradient-stops)); color: #111; border-radius: 0.75rem; width: 2.5rem; display: flex; align-items: center; justify-content: center; height: 2.5rem;">
              <span style="font-weight: 700; color: #111;">J</span>
            </div>
          </div>
          <span style="font-size: 2rem; font-weight: 700; color: #111;">Janka</span>
        </div>
        <p style="font-size: 1rem; opacity: 0.9; margin-bottom: 1.5rem; color: #111;">
          The smartest way to manage appointments and grow your business. Trusted by thousands of professionals worldwide.
        </p>
        <div style="display: flex; gap: 0.75rem;">
          <button style="border-radius: 9999px; background: none; color: #111; width: 2rem; height: 2rem;">📧</button>
          <button style="border-radius: 9999px; background: none; color: #111; width: 2rem; height: 2rem;">🐦</button>
          <button style="border-radius: 9999px; background: none; color: #111; width: 2rem; height: 2rem;">📱</button>
        </div>
      </div>
      <!-- Product and Support Links Side by Side -->
      <div style="display: flex; flex-direction: row; gap: 2rem; width: 100%; max-width: 40rem; justify-content: center; align-items: flex-start;" id="footer-links">
        <div style="color: #111; min-width: 10rem;">
          <span style="font-weight: 600; color: #111;">Product</span>
          <a style="display: block; margin-top: 0.5rem; color: #111;">Features</a>
          <a style="display: block; margin-top: 0.5rem; color: #111;">Pricing</a>
        </div>
        <div style="color: #111; min-width: 10rem;">
          <span style="font-weight: 600; color: #111;">Support</span>
          <a style="display: block; margin-top: 0.5rem; color: #111;">Help Center</a>
          <a style="display: block; margin-top: 0.5rem; color: #111;">Contact Us</a>
          <a style="display: block; margin-top: 0.5rem; color: #111;">Privacy</a>
          <a style="display: block; margin-top: 0.5rem; color: #111;">Terms</a>
        </div>
      </div>
    </div>
    <div style="border-top: 1px solid #e5e7eb; margin-top: 2rem; padding-top: 1rem; color: #111;">
      <p style="font-size: 1rem; opacity: 0.9; color: #111;">
        &copy; 2025 Janka. All rights reserved. Built with ❤️ for appointment scheduling excellence.
      </p>
    </div>
  </footer>
</div>

<style>
  @import url('https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.css');
  @import url('https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/base.css');
  :global(html) {
    scroll-behavior: smooth;
  }
  :global([data-theme="light"]) {
    --fallback-p: 259 94% 51%;
    --fallback-pc: 259 96% 91%;
    --fallback-s: 314 100% 47%;
    --fallback-sc: 314 100% 91%;
    --fallback-a: 174 60% 51%;
    --fallback-ac: 174 60% 15%;
  }
</style>