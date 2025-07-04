<script>
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	export let open = false;
	export let onClose = () => {};

	let email = '';
	let password = '';
    let firstName = '';
    let lastName = '';
	let phoneNumber = '';
	let loading = false;
	let error = null;

	async function handleSignUp() {
		try {
			loading = true;
			error = null;

			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						first_name: firstName,
						last_name: lastName,
						phone_number: phoneNumber
					}
				}
			});

			if (signUpError) throw signUpError;

			if (data.user) {
				onClose();
				await goto('/');
			}
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	function handleOverlayClick(e) {
		if (e.target === e.currentTarget) onClose();
	}
</script>

{#if open}
	<div class="modal-overlay" on:click={handleOverlayClick}>
		<div class="modal-content">
			<button class="close-btn" on:click={onClose} aria-label="Close">&times;</button>
			<div style="padding: 2rem;">
				<h1 style="font-size: 1.5rem; font-weight: bold; text-align: center;">Sign Up</h1>
				<form on:submit|preventDefault={handleSignUp}>
					<div style="margin-bottom: 1rem; display: flex; flex-direction: column;">
						<label style="margin-bottom: 0.5rem; font-weight: 500;" for="firstName">
							<span>First Name</span>
						</label>
						<input
							type="text"
							id="firstName"
							bind:value={firstName}
							style="padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 1rem; background: #fff;"
							required
						/>
					</div>
					<div style="margin-bottom: 1rem; display: flex; flex-direction: column;">
						<label style="margin-bottom: 0.5rem; font-weight: 500;" for="lastName">
							<span>Last Name</span>
						</label>
						<input
							type="text"
							id="lastName"
							bind:value={lastName}
							style="padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 1rem; background: #fff;"
							required
						/>
					</div>
					<div style="margin-bottom: 1rem; display: flex; flex-direction: column;">
						<label style="margin-bottom: 0.5rem; font-weight: 500;" for="lastName">
							<span>Phone Number</span>
						</label>
						<input
							type="text"
							id="phoneNumber"
							bind:value={phoneNumber}
							style="padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 1rem; background: #fff;"
							required
						/>
					</div>
					<div style="margin-bottom: 1rem; display: flex; flex-direction: column;">
						<label style="margin-bottom: 0.5rem; font-weight: 500;" for="email">
							<span>Email</span>
						</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							style="padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 1rem; background: #fff;"
							required
						/>
					</div>
					<div style="margin-bottom: 1rem; display: flex; flex-direction: column;">
						<label style="margin-bottom: 0.5rem; font-weight: 500;" for="password">
							<span>Password</span>
						</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							style="padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 1rem; background: #fff;"
							required
							minlength="6"
						/>
						<label style="margin-top: 0.5rem;">
							<span style="font-size: 0.875rem; color: #6b7280;"
								>Password must be at least 6 characters long</span
							>
						</label>
					</div>
					{#if error}
						<div
							style="background: #fee2e2; color: #991b1b; border-radius: 0.5rem; padding: 0.75rem 1rem; margin-top: 1rem; font-size: 1rem;"
						>
							<span>{error}</span>
						</div>
					{/if}
					<div style="margin-top: 1.5rem; display: flex; flex-direction: column;">
						<button
							type="submit"
							style="padding: 0.75rem 1rem; background: #FFECE6; color: #000; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center;"
							disabled={loading}
						>
							{#if loading}
								<span
									style="margin-right: 0.5rem; width: 1.25rem; height: 1.25rem; border: 2px solid #fff; border-top: 2px solid #3b82f6; border-radius: 50%; display: inline-block; animation: spin 1s linear infinite;"
								></span>
							{/if}
							Sign Up
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	.modal-content {
		background: var(--fallback-b1, #fff);
		border-radius: 0.75rem;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		max-width: 28rem;
		width: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		font-size: 2rem;
		color: #888;
		cursor: pointer;
	}
	.modal-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
		text-align: center;
	}
	.form-group {
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.form-group label {
		margin-bottom: 0.5rem;
		font-weight: 500;
	}
	.form-group input {
		padding: 0.75rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		outline: none;
		font-size: 1rem;
		background: #fff;
	}
	.signup-link {
		margin-top: 0.5rem;
		font-size: 0.875rem;
	}
	.error {
		background: #fee2e2;
		color: #991b1b;
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		margin-top: 1rem;
		font-size: 1rem;
		width: 100%;
		text-align: center;
	}
	.login-btn {
		margin-top: 1.5rem;
		padding: 0.75rem 1rem;
		background: #ffece6;
		color: #000;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.spinner {
		margin-right: 0.5rem;
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid #fff;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		display: inline-block;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
