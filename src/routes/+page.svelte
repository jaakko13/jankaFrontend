<script>
  import { onMount } from 'svelte';
  
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

  const features = [
    {
      icon: '📅',
      title: 'Smart Scheduling',
      description: 'AI-powered scheduling that adapts to your availability and preferences'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book appointments in seconds with our streamlined interface'
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Never miss an appointment with intelligent notification system'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track your booking patterns and optimize your schedule'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Healthcare Provider',
      text: 'Janka transformed how I manage patient appointments. The no-show rate dropped by 70%.',
      avatar: '👩‍⚕️'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Salon Owner',
      text: 'Our booking efficiency increased by 3x. Clients love the seamless experience.',
      avatar: '✂️'
    },
    {
      name: 'Emily Watson',
      role: 'Fitness Coach',
      text: 'The automated reminders and rescheduling features are game-changers.',
      avatar: '💪'
    }
  ];
</script>

<svelte:window bind:scrollY />

<!-- Navigation -->
<div class="navbar fixed top-0 left-0 right-0 w-screen z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300/50 transition-all duration-300"
     class:shadow-lg={scrollY > 50}>
  <div class="navbar-start">
    <div class="dropdown lg:hidden">
      <div tabindex="0" role="button" class="btn btn-ghost" on:click={toggleMobileMenu}>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </div>
      {#if mobileMenuOpen}
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-lg bg-base-100 rounded-box w-80">
          <li><a href="#features" on:click={closeMobileMenu} class="text-lg">Features</a></li>
          <li><a href="#pricing" on:click={closeMobileMenu} class="text-lg">Pricing</a></li>
          <li><a href="#testimonials" on:click={closeMobileMenu} class="text-lg">Reviews</a></li>
          <li><a href="#contact" on:click={closeMobileMenu} class="text-lg">Contact</a></li>
          <div class="divider"></div>
          <li><a href="/login" class="btn btn-ghost btn-block justify-start" sveltekit:prefetch>Log In</a></li>
          <li><a href="/signup"  class="btn btn-primary btn-block" sveltekit:prefetch>Sign Up</a></li>
        </ul>
      {/if}
    </div>
    
    <!-- Logo -->
    <a class="btn btn-ghost text-xl normal-case">
      <div class="avatar placeholder">
        <div class="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-xl w-8 sm:w-10">
          <span class="text-sm sm:text-lg font-bold">J</span>
        </div>
      </div>
      <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
        Janka
      </span>
    </a>
  </div>
  
  <!-- Desktop Navigation -->
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a href="#features" class="font-medium">Features</a></li>
      <li><a href="#pricing" class="font-medium">Pricing</a></li>
      <li><a href="#testimonials" class="font-medium">Reviews</a></li>
      <li><a href="#contact" class="font-medium">Contact</a></li>
    </ul>
  </div>
  
  <!-- Desktop Auth Buttons -->
  <div class="navbar-end hidden lg:flex">
    <div class="flex gap-2">
      <a href="/login" class="btn btn-ghost">Log In</a>
      <a href="/signup" class="btn btn-primary">Sign Up</a>
    </div>
  </div>
</div>

<!-- Hero Section -->
<div class="hero min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-primary/10 pt-16 text-white">
  <div class="hero-content text-center max-w-7xl">
    <div class="max-w-4xl">
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
        <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Schedule Smarter,
        </span>
        <br>
        <span style="color: #fff;">Live Better</span>
      </h1>
      
      <p class="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 leading-relaxed opacity-80 px-4 text-white">
        Transform your appointment booking experience with AI-powered scheduling that works seamlessly for both you and your clients.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16 px-4">
        <button class="btn btn-primary btn-lg w-full sm:w-auto">
          Start Free Trial
        </button>
        <button class="btn btn-outline btn-lg w-full sm:w-auto">
          Watch Demo
        </button>
      </div>

      <!-- Stats -->
      <div class="stats stats-vertical sm:stats-horizontal shadow-lg bg-base-100">
        <div class="stat">
          <div class="stat-value text-white">10M+</div>
          <div class="stat-desc text-white">Appointments Booked</div>
        </div>
        <div class="stat">
          <div class="stat-value text-white">50K+</div>
          <div class="stat-desc text-white">Happy Businesses</div>
        </div>
        <div class="stat">
          <div class="stat-value text-white">99.9%</div>
          <div class="stat-desc text-white">Uptime Guarantee</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Features Section -->
<section id="features" class="py-16 sm:py-20 bg-base-100 text-white">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12 sm:mb-16">
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
        Everything You Need to
        <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Succeed
        </span>
      </h2>
      <p class="text-lg sm:text-xl opacity-70 max-w-3xl mx-auto px-4 text-white">
        Powerful features designed to streamline your booking process and delight your customers
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {#each features as feature, i}
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300 text-white"
             style="animation-delay: {i * 100}ms">
          <div class="card-body">
            <div class="text-3xl sm:text-4xl mb-4 transition-transform duration-300 hover:scale-110 text-white">
              {feature.icon}
            </div>
            <h3 class="card-title text-lg sm:text-xl text-white">{feature.title}</h3>
            <p class="text-sm sm:text-base opacity-90 text-white">{feature.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Testimonials Section -->
<section id="testimonials" class="py-16 sm:py-20 bg-base-200 text-white">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12 sm:mb-16">
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
        Loved by
        <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Thousands
        </span>
      </h2>
      <p class="text-lg sm:text-xl opacity-90 text-white">See what our customers have to say</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {#each testimonials as testimonial, i}
        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 text-white"
             style="animation-delay: {i * 150}ms">
          <div class="card-body">
            <div class="flex items-center mb-4">
              <div class="avatar placeholder mr-4">
                <div class="bg-neutral text-neutral-content rounded-full w-12 h-12">
                  <span class="text-xl text-white">{testimonial.avatar}</span>
                </div>
              </div>
              <div>
                <div class="font-bold text-white">{testimonial.name}</div>
                <div class="badge badge-outline badge-sm text-white">{testimonial.role}</div>
              </div>
            </div>
            <blockquote class="text-sm sm:text-base opacity-90 mb-4 text-white">
              "{testimonial.text}"
            </blockquote>
            <div class="rating rating-sm">
              <input type="radio" name="rating-{i}" class="mask mask-star-2 bg-warning" disabled checked />
              <input type="radio" name="rating-{i}" class="mask mask-star-2 bg-warning" disabled checked />
              <input type="radio" name="rating-{i}" class="mask mask-star-2 bg-warning" disabled checked />
              <input type="radio" name="rating-{i}" class="mask mask-star-2 bg-warning" disabled checked />
              <input type="radio" name="rating-{i}" class="mask mask-star-2 bg-warning" disabled checked />
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Section -->
<div class="hero py-16 sm:py-20 bg-gradient-to-r from-primary via-secondary to-accent text-white">
  <div class="hero-content text-center text-primary-content">
    <div class="max-w-4xl">
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
        Ready to Transform Your Business?
      </h2>
      <p class="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 text-white">
        Join thousands of businesses already using Janka to streamline their appointment booking
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="btn btn-neutral btn-lg w-full sm:w-auto">
          Start Your Free Trial
        </button>
        <button class="btn btn-outline btn-lg w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
          Schedule a Demo
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Footer -->
<footer class="footer footer-center p-10 bg-base-200 text-white">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl">
    <!-- Company Info -->
    <div class="col-span-1 sm:col-span-2 lg:col-span-2 text-left">
      <div class="flex items-center mb-6">
        <div class="avatar placeholder mr-3">
          <div class="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-xl w-10">
            <span class="font-bold text-white">J</span>
          </div>
        </div>
        <span class="text-2xl font-bold text-white">Janka</span>
      </div>
      <p class="text-sm sm:text-base opacity-90 mb-6 max-w-md text-white">
        The smartest way to manage appointments and grow your business. Trusted by thousands of professionals worldwide.
      </p>
      <div class="flex gap-3">
        <button class="btn btn-circle btn-ghost btn-sm text-white">📧</button>
        <button class="btn btn-circle btn-ghost btn-sm text-white">🐦</button>
        <button class="btn btn-circle btn-ghost btn-sm text-white">📱</button>
      </div>
    </div>
    
    <!-- Product Links -->
    <div class="col-span-1">
      <div class="mb-4">
        <span class="footer-title text-white">Product</span>
        <a class="link link-hover text-white">Features</a>
        <a class="link link-hover text-white">Pricing</a>
        <a class="link link-hover text-white">Integrations</a>
        <a class="link link-hover text-white">API</a>
      </div>
    </div>
    
    <!-- Support Links -->
    <div class="col-span-1">
      <div class="mb-4">
        <span class="footer-title text-white">Support</span>
        <a class="link link-hover text-white">Help Center</a>
        <a class="link link-hover text-white">Contact Us</a>
        <a class="link link-hover text-white">Privacy</a>
        <a class="link link-hover text-white">Terms</a>
      </div>
    </div>
  </div>
  
  <!-- Footer Bottom -->
  <div class="divider"></div>
  <div>
    <p class="text-sm opacity-90 text-white">
      &copy; 2025 Janka. All rights reserved. Built with ❤️ for appointment scheduling excellence.
    </p>
  </div>
</footer>

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