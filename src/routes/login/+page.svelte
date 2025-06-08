<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

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
        // Redirect to dashboard or home page after successful login
        await goto('/');
      }
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen hero bg-base-200">
  <div class="hero-content flex-col">
    <div class="card w-full max-w-md shadow-2xl bg-base-100">
      <div class="card-body">
        <h1 class="text-2xl font-bold text-center">Login</h1>
        <form on:submit|preventDefault={handleLogin}>
          <div class="form-control">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <input type="email" id="email" bind:value={email} class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label" for="password">
              <span class="label-text">Password</span>
            </label>
            <input type="password" id="password" bind:value={password} class="input input-bordered" required />
            <label class="label">
              <a href="/signup" class="label-text-alt link link-hover">Don't have an account?</a>
            </label>
          </div>
          {#if error}
            <div class="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          {/if}
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary" disabled={loading}>
              {#if loading}
                <span class="loading loading-spinner"></span>
              {/if}
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>