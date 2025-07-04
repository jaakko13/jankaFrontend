<script lang="ts">
	import { user } from '$lib/auth';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import LoginModal from '$lib/LoginModal.svelte';
	import SignUpModal from '$lib/SignupModal.svelte';
	import SignupModal from '$lib/SignupModal.svelte';

	let scrollY = 0;
	let menuOpen = false;
	let userDropdownOpen = false;
	let dropdownRef: HTMLDivElement | null = null;
	let isMobile = false;
	let loginModalOpen = false;
	let signUpModalOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			await goto('/login');
			closeMenu();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (menuOpen && dropdownRef && !dropdownRef.contains(event.target as Node)) {
			closeMenu();
		}
	}

	function checkMobile() {
		isMobile = window.innerWidth <= 768;
	}

	onMount(() => {
		const handleScroll = () => (scrollY = window.scrollY);
		window.addEventListener('scroll', handleScroll);
		document.addEventListener('mousedown', handleClickOutside);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<svelte:window bind:scrollY />

<div style="min-height: 100vh; color: #111;">
	<!-- Navigation -->
	<nav
		style="position: fixed; top: 0; left: 0; right: 0; width: 100vw; z-index: 50; background-color: #E6E9FF; transition: box-shadow 0.3s; box-shadow: {scrollY >
		5
			? '0 4px 12px rgba(0,0,0,0.2)'
			: 'none'}; color: #111;"
	>
		<div
			style="display: flex; align-items: center; max-width: 1280px; margin: 0 auto; padding: 0 1rem; height: 4rem; color: #111;"
		>
			<!-- Logo -->
			<a
				href="/"
				style="display: flex; align-items: center; font-size: 1.25rem; font-weight: 700; text-transform: none; padding: 0.5rem 1rem; color: #111;"
			>
				<div style="margin-right: 0.5rem;"></div>
				<span
					style="background: linear-gradient(to right, #a855f7, #f59e42); -webkit-background-clip: text; color: #111; font-weight: 700;"
					>Janka</span
				>
			</a>
			<!-- Desktop Nav Items -->
			{#if !isMobile}
				<div
					style="margin-left: auto; display: flex; align-items: center; gap: 1.5rem; color: #111;"
				>
					<a href="/businessCreate" style="color: #111; font-weight: 500;">For Business</a>
					{#if $user}
						<a href="/profile" style="color: #111; font-weight: 500;">Profile</a>
						<a href="/calendar" style="color: #111; font-weight: 500;">Calendar</a>
						<a
							href="/"
							on:click|preventDefault={handleLogout}
							style="color: #111; font-weight: 500;">Logout</a
						>
						<div style="margin-left: 1rem; display: flex; align-items: center;">
							<div style="width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden;">
								<img
									src={`https://api.dicebear.com/7.x/initials/svg?seed=${$user?.email ?? ''}`}
									alt="avatar"
									style="width: 100%; height: 100%; object-fit: cover;"
								/>
							</div>
						</div>
					{:else}
						<a
							href="#"
							sveltekit:prefetch
							style="color: #111; font-weight: 500;"
							on:click|preventDefault={() => (loginModalOpen = true)}>Log In</a
						>
						<a
							href="#"
							sveltekit:prefetch
							style="color: #111; font-weight: 500;"
							on:click|preventDefault={() => (signUpModalOpen = true)}>Sign Up</a
						>
					{/if}
				</div>
			{/if}
			<!-- Hamburger Menu (Mobile Only) -->
			{#if isMobile}
				<div style="margin-left: auto; display: flex; align-items: center; color: #111;">
					<button
						type="button"
						aria-label="Open menu"
						style="background: none; border: none; padding: 0.5rem; color: #111; display: block;"
						on:click={toggleMenu}
						id="menu-btn"
					>
						<svg
							style="width: 1.5rem; height: 1.5rem; color: #111;"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
							/>
						</svg>
					</button>
					{#if $user}
						<div style="margin-left: 1rem; display: flex; align-items: center;">
							<div style="width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden;">
								<img
									src={`https://api.dicebear.com/7.x/initials/svg?seed=${$user?.email ?? ''}`}
									alt="avatar"
									style="width: 100%; height: 100%; object-fit: cover;"
								/>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<!-- Combined Dropdown Menu (Mobile Only) -->
		{#if isMobile && menuOpen}
			<div
				bind:this={dropdownRef}
				style="position: fixed; top: 4rem; right: 0; width: 20vw; min-width: 220px; max-width: 320px; background: #fff; z-index: 100; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border-radius: 0 0 0 0.75rem; padding: 1.5rem; color: #111; display: flex; justify-content: flex-end;"
			>
				<ul
					style="display: flex; flex-direction: column; gap: 1rem; color: #111; width: 100%; align-items: center;"
				>
					<li style="width: 100%;">
						<a
							href="/businessCreate"
							on:click={closeMenu}
							style="color: #111; width: 100%; display: block; text-align: center;">For Business</a
						>
					</li>
					{#if $user}
						<li style="width: 100%;">
							<a
								href="/profile"
								on:click={closeMenu}
								style="color: #111; width: 100%; display: block; text-align: center;">Profile</a
							>
						</li>
						<li style="width: 100%;">
							<a
								href="/calendar"
								on:click={closeMenu}
								style="color: #111; width: 100%; display: block; text-align: center;">Calendar</a
							>
						</li>
						<li style="width: 100%;">
							<a
								href="/"
								on:click|preventDefault={handleLogout}
								style="color: #111; width: 100%; display: block; text-align: center;">Logout</a
							>
						</li>
					{:else}
						<li style="width: 100%;">
							<a
								href="#"
								on:click|preventDefault={() => {
									loginModalOpen = true;
									closeMenu();
								}}
								sveltekit:prefetch
								style="color: #111; width: 100%; display: block; text-align: center;">Log In</a
							>
						</li>
						<li style="width: 100%;">
							<a
								href="#"
								on:click|preventDefault={() => {
									signUpModalOpen = true;
									closeMenu();
								}}
								sveltekit:prefetch
								style="color: #111; width: 100%; display: block; text-align: center;">Sign Up</a
							>
						</li>
					{/if}
				</ul>
			</div>
		{/if}
	</nav>
	<main style="padding-top: 4rem; color: #111;">
		<slot />
	</main>
	<LoginModal
		open={loginModalOpen}
		onClose={() => (loginModalOpen = false)}
		onOpenSignUp={() => {
			loginModalOpen = false;
			signUpModalOpen = true;
		}}
	/>
	<SignupModal open={signUpModalOpen} onClose={() => (signUpModalOpen = false)} />
</div>
