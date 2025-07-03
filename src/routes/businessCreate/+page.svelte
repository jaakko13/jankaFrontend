<script lang="ts">
	import { enhance } from '$app/forms';
	import { supabase } from '$lib/supabase';

	let formData = {
		businessName: '',
		fullName: '',
		yTunnus: '',
		ownerName: '',
		email: '',
		phone: '',
		description: '',
		category: '',
		address: '',
		website: ''
	};

	let submitting = false;
	let success = false;
	let error = '';

	let yTunnusError = '';
	let phoneError = '';

	const categories = [
		'Massage',
		'Therapy',
		'Hair Salon',
		'Healthcare',
		'Beauty & Wellness',
		'Entertainment',
		'Other'
	];

	const validateYTunnus = (value: string) => {
		// Format: 1234567-8 (7 digits, dash, 1 digit)
		return /^\d{7}-\d{1}$/.test(value);
	};

	const validatePhone = (value: string) => {
		// International phone: starts with + or digit, then 7-15 digits
		return /^\+?\d{7,15}$/.test(value);
	};

	const handleSubmit = async (e: SubmitEvent) => {
		yTunnusError = '';
		phoneError = '';
		submitting = true;
		error = '';
		success = false;

		// Validate required fields (only those needed for DB)
		if (
			!formData.businessName ||
			!formData.fullName ||
			!formData.yTunnus ||
			!formData.email ||
			!formData.phone ||
			!formData.category ||
			!formData.address
		) {
			error = 'Please fill in all required fields.';
			submitting = false;
			return;
		}

		if (!validateYTunnus(formData.yTunnus)) {
			yTunnusError = 'Y-tunnus must be in the format 1234567-8.';
			submitting = false;
			return;
		}
		if (!validatePhone(formData.phone)) {
			phoneError = 'Please enter a valid phone number (international format allowed).';
			submitting = false;
			return;
		}

		try {
			const { error: dbError } = await supabase.from('Vendors').insert([
				{
					vendor_name: formData.businessName,
					ytunnus: formData.yTunnus,
					email: formData.email,
					phone: formData.phone,
					category: formData.category,
					address: formData.address,
					full_name: formData.fullName
				}
			]);
			if (dbError) throw dbError;
			success = true;
			formData = {
				businessName: '',
				fullName: '',
				yTunnus: '',
				ownerName: '',
				email: '',
				phone: '',
				description: '',
				category: '',
				address: '',
				website: ''
			};
		} catch (err) {
			error = 'Failed to submit business information. Please try again.';
		} finally {
			submitting = false;
		}
	};
</script>

<div
	style="min-height: 100vh; padding-top: 5rem; padding-left: 0; padding-right: 0; padding-bottom: 0; background: #E6E9FF;"
>
	<div style="max-width: 56rem; margin-left: auto; margin-right: auto;">
		<div
			style="background-color: var(--base-100, #fff); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border-radius: 0.75rem;"
		>
			<div style="padding: 2rem;">
				<form
					on:submit|preventDefault={handleSubmit}
					style="display: flex; flex-direction: column; gap: 1.5rem; width: 50%; min-width: 320px; margin: 0 auto;"
				>
					<div style="display: flex; flex-direction: column; gap: 1.5rem;">
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="fullName" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Full Name*</span>
							</label>
							<input
								type="text"
								id="fullName"
								bind:value={formData.fullName}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; background: #fff;"
								required
							/>
						</div>
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="businessName" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Business Name*</span>
							</label>
							<input
								type="text"
								id="businessName"
								bind:value={formData.businessName}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; background: #fff;"
								required
							/>
						</div>
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="yTunnus" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Y-tunnus (Business ID)*</span>
								<span style="font-size: 0.875rem; color: #6b7280; margin-left: 0.5rem;"
									>Format: 1234567-8</span
								>
							</label>
							<input
								type="text"
								id="yTunnus"
								bind:value={formData.yTunnus}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; background: #fff;"
								placeholder="1234567-8"
								title="Format: 1234567-8 (7 digits, dash, 1 digit)"
								inputmode="numeric"
								required
							/>
							{#if yTunnusError}
								<span style="color: #dc2626; font-size: 0.95rem; margin-top: 0.25rem;"
									>{yTunnusError}</span
								>
							{/if}
						</div>
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="email" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Email*</span>
							</label>
							<input
								type="email"
								id="email"
								bind:value={formData.email}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; background: #fff;"
								required
							/>
						</div>
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="ownerName" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Owner Name*</span>
							</label>
							<input
								type="text"
								id="ownerName"
								bind:value={formData.ownerName}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; background: #fff;"
								required
							/>
						</div>
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="phone" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Phone Number*</span>
							</label>
							<input
								type="text"
								id="phone"
								bind:value={formData.phone}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; background: #fff;"
								inputmode="tel"
								min="0"
								required
							/>
							{#if phoneError}
								<span style="color: #dc2626; font-size: 0.95rem; margin-top: 0.25rem;"
									>{phoneError}</span
								>
							{/if}
						</div>
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="category" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Business Category*</span>
								<span style="font-size: 0.875rem; color: #6b7280; margin-left: 0.5rem;"
									>Select All That Apply</span
								>
							</label>
							<select
								id="category"
								bind:value={formData.category}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; background: #fff;"
								required
							>
								<option value="">Select a category</option>
								{#each categories as category}
									<option value={category}>{category}</option>
								{/each}
							</select>
						</div>
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="address" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Business Address*</span>
							</label>
							<input
								type="text"
								id="address"
								bind:value={formData.address}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; background: #fff;"
								required
							/>
						</div>
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="website" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Website*</span>
							</label>
							<input
								type="text"
								id="website"
								bind:value={formData.website}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; background: #fff;"
								required
							/>
						</div>
						<div style="display: flex; flex-direction: column; width: 100%;">
							<label for="description" style="margin-bottom: 0.5rem; font-weight: 500;">
								<span>Description*</span>
							</label>
							<textarea
								id="description"
								bind:value={formData.description}
								style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; min-height: 4rem; background: #fff;"
								required
							></textarea>
						</div>
					</div>
					{#if error}
						<div
							style="background-color: #fee2e2; color: #991b1b; display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 0.5rem;"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								style="stroke: currentColor; flex-shrink: 0; height: 1.5rem; width: 1.5rem;"
								fill="none"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
							<span>{error}</span>
						</div>
					{/if}
					{#if success}
						<div
							style="background-color: #d1fae5; color: #065f46; display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 0.5rem;"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								style="stroke: currentColor; flex-shrink: 0; height: 1.5rem; width: 1.5rem;"
								fill="none"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
							<span>Your business information has been submitted successfully!</span>
						</div>
					{/if}
					<div style="display: flex; justify-content: center;">
						<button
							type="submit"
							style="background-color: #2563eb; color: #fff; font-size: 1.125rem; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;"
							disabled={submitting}
						>
							{#if submitting}
								<span
									style="display: inline-block; border: 2px solid #fff; border-top: 2px solid #2563eb; border-radius: 50%; width: 1.25rem; height: 1.25rem; animation: spin 1s linear infinite;"
								></span>
								Submitting...
							{:else}
								Submit Business
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
	<!-- Footer -->
	<footer style="text-align: center; padding: 2.5rem; color: #111;">
		<div
			style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; max-width: 80rem; margin: 0 auto; color: #111;"
		>
			<!-- Company Info -->
			<div style="text-align: left; color: #111; width: 100%; max-width: 28rem;">
				<div style="display: flex; align-items: center; margin-bottom: 1.5rem; color: #111;">
					<div style="margin-right: 0.75rem;">
						<div
							style=" color: #111; border-radius: 0.75rem; width: 2.5rem; display: flex; align-items: center; justify-content: center; height: 2.5rem;"
						>
							<span style="font-weight: 700, color: #111;">J</span>
						</div>
					</div>
					<span style="font-size: 2rem; font-weight: 700, color: #111;">Janka</span>
				</div>
				<p style="font-size: 1rem; opacity: 0.9; margin-bottom: 1.5rem; color: #111;">
					The smartest way to manage appointments and grow your business. Trusted by thousands of
					professionals worldwide.
				</p>
				<div style="display: flex; gap: 0.75rem;">
					<button
						style="border-radius: 9999px; background: none; color: #111; width: 2rem; height: 2rem;"
						>📧</button
					>
					<button
						style="border-radius: 9999px; background: none; color: #111; width: 2rem; height: 2rem;"
						>🐦</button
					>
					<button
						style="border-radius: 9999px; background: none; color: #111; width: 2rem; height: 2rem;"
						>📱</button
					>
				</div>
			</div>
			<!-- Product and Support Links Side by Side -->
			<div
				style="display: flex; flex-direction: row; gap: 2rem; width: 100%; max-width: 40rem; justify-content: center; align-items: flex-start;"
				id="footer-links"
			>
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
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
