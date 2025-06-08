<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let loading = false;
  let error = null;

  async function handleSignUp() {
    try {
      loading = true;
      error = null;

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Redirect to confirmation page or dashboard
        await goto('/login');
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
        <h1 class="text-2xl font-bold text-center">Sign Up</h1>
        <form on:submit|preventDefault={handleSignUp}>
          <div class="form-control">
            <label class="label" for="firstName">
              <span class="label-text">First Name</span>
            </label>
            <input type="text" id="firstName" bind:value={firstName} class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label" for="lastName">
              <span class="label-text">Last Name</span>
            </label>
            <input type="text" id="lastName" bind:value={lastName} class="input input-bordered" required />
          </div>
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
            <input type="password" id="password" bind:value={password} class="input input-bordered" required minlength="6" />
            <label class="label">
              <span class="label-text-alt text-gray-500">Password must be at least 6 characters long</span>
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
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
