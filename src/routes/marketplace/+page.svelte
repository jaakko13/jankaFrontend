<script>
	import { onMount } from 'svelte';
	import { user } from '$lib/auth';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import maplibregl from 'maplibre-gl';

	let scrollY = 0;
	let mobileMenuOpen = false;
	let vendors = [];
	let searchValue = '';

	$: searchValue = $page.url.searchParams.get('search') || '';
	let mapContainer;

	onMount(async () => {
		var map = new maplibregl.Map({
			container: mapContainer, // container id
			style:
				'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL', // style URL
			center: [23.739395, 61.497492], // starting position [lng, lat]
			zoom: 11 // starting zoom
		});

		if (searchValue) {
			const { data, error } = await supabase
				.from('Vendors')
				.select()
				.eq('vendor_name', searchValue);
			vendors = data || [];
		}
		const handleScroll = () => (scrollY = window.scrollY);
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

	let selectedVendor = null;
	let showModal = false;

	function openVendorModal(vendor) {
		selectedVendor = vendor;
		showModal = true;
	}

	function closeVendorModal() {
		showModal = false;
		selectedVendor = null;
	}

	let appointmentDate = '';
	let appointmentTime = '';
	let bookingMessage = '';

	const today = new Date().toISOString().split('T')[0];

	let weekDays = [];
	let selectedDay = '';
	let availableTimes = [];
	let selectedTime = '';

	let weekOffset = 0;

	function getWeekDays(offset = 0) {
		const todayDate = new Date();
		const start = new Date(todayDate);
		start.setDate(todayDate.getDate() - todayDate.getDay() + offset * 7); // Sunday of offset week
		const days = [];
		for (let i = 0; i < 7; i++) {
			const d = new Date(start);
			d.setDate(start.getDate() + i);
			days.push({
				label: d.toLocaleDateString(undefined, {
					weekday: 'short',
					month: 'short',
					day: 'numeric'
				}),
				value: d.toISOString().split('T')[0],
				isToday: d.toDateString() === todayDate.toDateString()
			});
		}
		return days;
	}

	function getAvailableTimesForDay(day) {
		// Example: 9am-5pm every 30min
		const slots = [];
		for (let h = 9; h < 17; h++) {
			slots.push(`${h.toString().padStart(2, '0')}:00`);
			slots.push(`${h.toString().padStart(2, '0')}:30`);
		}
		return slots;
	}

	$: weekDays = getWeekDays(weekOffset);
	$: if (selectedDay) availableTimes = getAvailableTimesForDay(selectedDay);

	function selectDay(day) {
		selectedDay = day;
		selectedTime = '';
		bookingMessage = '';
	}

	function selectTime(time) {
		selectedTime = time;
		bookingMessage = '';
	}

	function bookAppointment() {
		if (selectedDay && selectedTime) {
			bookingMessage = `Appointment booked for ${selectedDay} at ${selectedTime}!`;
			selectedDay = '';
			selectedTime = '';
			setTimeout(() => (bookingMessage = ''), 3000);
		}
	}

	function prevWeek() {
		weekOffset--;
		selectedDay = '';
		selectedTime = '';
	}

	function nextWeek() {
		weekOffset++;
		selectedDay = '';
		selectedTime = '';
	}
</script>

<svelte:window bind:scrollY />

<div
	style="width: 100%; background: #fff; border-bottom: 2px solid #B3D6FF; display: flex; align-items: center; z-index: 10; position: sticky; top: 0; height: auto; min-height: 0; padding: 0; margin: 0;"
>
	<!-- Nav content goes here, e.g. logo, links, etc. -->
</div>

<div
	style="display: flex; flex-direction: column; height: 100vh; background-color: #E6E9FF; overflow: hidden;"
>
	<div style="display: flex; flex: 1 1 auto; width: 100%; height: 100%;">
		<!-- Search Results Section -->
		{#if searchValue}
			<section
				style="width: 50vw; min-width: 22rem; max-width: 50vw; display: flex; flex-direction: column; align-items: flex-start; padding: 2rem 1.5rem 0 2rem; background-color: #E6E9FF; border-right: 1px solid #B3D6FF; height: 100vh; position: sticky; top: 0; overflow-y: auto;"
			>
				<div
					style="background: #fff; border-radius: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 2rem; width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; border: 1px solid #B3D6FF;"
				>
					<h2 style="font-size: 1.25rem; font-weight: 600; color: #222; margin-bottom: 0.5rem;">
						Search Results for "{searchValue}"
					</h2>
					{#if vendors.length > 0}
						<div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%;">
							{#each vendors as vendor}
								<div
									style="background: #f8fafc; border-radius: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 1.5rem; min-width: 16rem; max-width: 20rem; width: 100%; cursor: pointer; border: 1px solid #B3D6FF; display: flex; flex-direction: column; align-items: flex-start; transition: box-shadow 0.2s;"
									on:click={() => openVendorModal(vendor)}
									on:keydown={(e) => e.key === 'Enter' && openVendorModal(vendor)}
									tabindex="0"
									aria-label={`View details for ${vendor.vendor_name}`}
								>
									<h3
										style="font-size: 1.1rem; font-weight: 600; color: #222; margin-bottom: 0.5rem;"
									>
										{vendor.vendor_name}
									</h3>
									{#if vendor.description}
										<p style="font-size: 0.95rem; color: #444; margin-bottom: 0.5rem;">
											{vendor.description}
										</p>
									{/if}
									{#if vendor.category}
										<p style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
											Category: {vendor.category}
										</p>
									{/if}
									{#if vendor.location}
										<p style="font-size: 0.9rem; color: #666;">Location: {vendor.location}</p>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<p style="color: #888;">No vendors found.</p>
					{/if}
				</div>
			</section>
		{/if}

		<!-- Main Content (Modal, etc. and Map) -->
		<div
			style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; align-items: stretch; height: 100vh;"
		>
			{#if showModal && selectedVendor}
				<div
					style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 1000;"
				>
					<div
						style="background: #fff; border-radius: 1rem; padding: 2rem; min-width: 20rem; max-width: 90vw; box-shadow: 0 4px 24px rgba(0,0,0,0.15); position: relative;"
					>
						<button
							on:click={closeVendorModal}
							style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;"
							>&times;</button
						>
						<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">
							{selectedVendor.vendor_name}
						</h2>
						{#if selectedVendor.description}
							<p style="margin-bottom: 1rem; color: #444;">{selectedVendor.description}</p>
						{/if}
						{#if selectedVendor.category}
							<p style="margin-bottom: 0.5rem; color: #666;">Category: {selectedVendor.category}</p>
						{/if}
						{#if selectedVendor.location}
							<p style="margin-bottom: 0.5rem; color: #666;">Location: {selectedVendor.location}</p>
						{/if}
						{#if selectedVendor.email}
							<p style="margin-bottom: 0.5rem; color: #666;">Email: {selectedVendor.email}</p>
						{/if}
						{#if selectedVendor.phone}
							<p style="margin-bottom: 0.5rem; color: #666;">Phone: {selectedVendor.phone}</p>
						{/if}

						<!-- Scheduling Calendar -->
						<div style="margin-top: 2rem; width: 100%;">
							<h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">
								Book an Appointment
							</h3>
							<!-- Week Calendar -->
							<div
								style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; justify-content: center;"
							>
								<button
									on:click={prevWeek}
									aria-label="Previous week"
									style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #60a5fa;"
									>&#8592;</button
								>
								<div style="display: flex; gap: 0.5rem;">
									{#each weekDays as day}
										<button
											on:click={() => selectDay(day.value)}
											style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #B3D6FF; background: {selectedDay ===
											day.value
												? '#B3D6FF'
												: '#fff'}; color: #222; font-weight: {day.isToday
												? 700
												: 500}; box-shadow: {day.isToday
												? '0 0 0 2px #60a5fa'
												: 'none'}; cursor: pointer;"
										>
											{day.label}
										</button>
									{/each}
								</div>
								<button
									on:click={nextWeek}
									aria-label="Next week"
									style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #60a5fa;"
									>&#8594;</button
								>
							</div>
							<!-- Time Slots -->
							{#if selectedDay}
								<div
									style="display: flex; flex-direction: row; gap: 2rem; margin-bottom: 1rem; justify-content: center;"
								>
									{#each [0, 1] as colIdx}
										<div style="display: flex; flex-direction: column; gap: 0.5rem;">
											{#each availableTimes.filter((_, i) => i % 2 === colIdx) as time}
												<button
													on:click={() => selectTime(time)}
													style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #B3D6FF; background: {selectedTime ===
													time
														? '#B3D6FF'
														: '#fff'}; color: #222; cursor: pointer; min-width: 5.5rem;"
													>{time}</button
												>
											{/each}
										</div>
									{/each}
								</div>
							{/if}
							<!-- Book Button -->
							<form
								on:submit|preventDefault={bookAppointment}
								style="display: flex; flex-direction: column; gap: 1rem; align-items: center;"
							>
								<button
									type="submit"
									disabled={!selectedDay || !selectedTime}
									style="background: #B3D6FF; color: #222; border: none; border-radius: 0.5rem; padding: 0.5rem 1.5rem; font-weight: 600; cursor: pointer; opacity: {selectedDay &&
									selectedTime
										? 1
										: 0.5};">Book</button
								>
								{#if bookingMessage}
									<p style="color: #16a34a;">{bookingMessage}</p>
								{/if}
							</form>
						</div>
					</div>
				</div>
			{/if}

			<!-- Map only on the right/main content side -->
			<div
				bind:this={mapContainer}
				style="width: 100%; height: 100%; flex: 1 1 auto; margin: 0;"
			></div>
		</div>
	</div>
</div>

<style>
	@import url('https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.css');
	@import url('https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/base.css');
	:global(html) {
		scroll-behavior: smooth;
		height: 100%;
		overflow: hidden;
	}
	:global(body) {
		height: 100%;
		overflow: hidden;
	}
	:global([data-theme='light']) {
		--fallback-p: 259 94% 51%;
		--fallback-pc: 259 96% 91%;
		--fallback-s: 314 100% 47%;
		--fallback-sc: 314 100% 91%;
		--fallback-a: 174 60% 51%;
		--fallback-ac: 174 60% 15%;
	}
</style>
