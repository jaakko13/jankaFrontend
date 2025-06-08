<script>
  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      await goto('/login');
    }
  }
</script>

<div class="min-h-screen">
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl">Janka</a>
    </div>
    <div class="flex-none">
      {#if $user}
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${$user.email}`} alt="avatar" />
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="/profile">Profile</a></li>
            <li><button on:click={handleLogout}>Logout</button></li>
          </ul>
        </div>
      {:else}
        <a href="/login" class="btn btn-ghost">Login</a>
        <a href="/signup" class="btn btn-primary">Sign Up</a>
      {/if}
    </div>
  </div>

  <slot />
</div>
