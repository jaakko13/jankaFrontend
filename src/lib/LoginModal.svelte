<script>
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	export let open = false;
	export let onClose = () => {};
	export let onOpenSignUp = () => {};

	let email = '';
	let password = '';
	let loading = false;
	let error = null;

	async function handleLogin() {
		try {
			loading = true;
			error = null;

			const { data, error: signInError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (signInError) throw signInError;

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

	function signInWithGoogle() {
		supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: window.location.origin
			}
		});
	}
</script>

{#if open}
	<div class="modal-overlay" on:click={handleOverlayClick}>
		<div class="modal-content">
			<button class="close-btn" on:click={onClose} aria-label="Close">&times;</button>
			<h1 class="modal-title">Login</h1>
			<button on:click={signInWithGoogle} class="login-btn" disabled={loading}>
					{#if loading}
						<span class="spinner"></span>
					{/if}
					Login With Google
				</button>
			<form on:submit|preventDefault={handleLogin}>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" bind:value={email} required />
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" id="password" bind:value={password} required />
					<label class="signup-link">
						<a
							href="#"
							style="color: #3b82f6; text-decoration: underline;"
							on:click|preventDefault={() => {
								onClose();
								onOpenSignUp();
							}}
						>
							Don't have an account?
						</a>
					</label>
				</div>
				{#if error}
					<div class="error">{error}</div>
				{/if}
				<button type="submit" class="login-btn" disabled={loading}>
					{#if loading}
						<span class="spinner"></span>
					{/if}
					Login
				</button>
			</form>
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
