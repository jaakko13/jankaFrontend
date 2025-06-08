<script>
// @ts-nocheck

  import { user } from '$lib/auth';
  import { supabase } from '$lib/supabase';

  let loading = false;
  let message = '';
  let firstName = '';
  let lastName = '';
  let businessAddress = '';
  let yTunnus = '';
  let phoneNumber = '';

  $: if ($user?.user_metadata) {
    firstName = $user.user_metadata.first_name || '';
    lastName = $user.user_metadata.last_name || '';
    businessAddress = $user.user_metadata.business_address || '';
    yTunnus = $user.user_metadata.y_tunnus || '';
    phoneNumber = $user.user_metadata.phone_number || '';
  }

  async function updateProfile() {
    try {
      loading = true;
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          business_address: businessAddress,
          y_tunnus: yTunnus,
          phone_number: phoneNumber
        }
      });

      if (error) throw error;
      message = 'Profile updated successfully';
    } catch (error) {
      message = error.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-base-200 py-8 text-white">
  <div class="max-w-2xl mx-auto">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-4 text-white">Your Profile</h2>
        
        {#if $user}
          <div class="flex items-center gap-4 mb-6">
            <div class="avatar">
              <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${$user.email}`} alt="avatar" />
              </div>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{$user.email}</h3>
              <p class="text-white/70">Member since {new Date($user.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <form on:submit|preventDefault={updateProfile} class="space-y-4">
            <div class="divider text-white">Personal Information</div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-white">First Name</span>
                </label>
                <input 
                  type="text" 
                  id="firstName" 
                  bind:value={firstName} 
                  class="input input-bordered text-white" 
                  placeholder="Enter your first name"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text text-white">Last Name</span>
                </label>
                <input 
                  type="text" 
                  id="lastName" 
                  bind:value={lastName} 
                  class="input input-bordered text-white" 
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div class="divider text-white">Business Information</div>

            <div class="form-control">
              <label class="label">
                <span class="label-text text-white">Business Address</span>
              </label>
              <input 
                type="text" 
                id="businessAddress" 
                bind:value={businessAddress} 
                class="input input-bordered text-white" 
                placeholder="Enter your business Address"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text text-white">Y-tunnus</span>
                  <span class="label-text-alt text-white">Business ID</span>
                </label>
                <input 
                  type="text" 
                  id="yTunnus" 
                  bind:value={yTunnus} 
                  class="input input-bordered text-white" 
                  placeholder="1234567-8"
                  pattern="\d{7}-\d"
                  title="Format: 1234567-8"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text text-white">Phone Number</span>
                </label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  bind:value={phoneNumber} 
                  class="input input-bordered text-white" 
                  placeholder="+358 40 123 4567"
                />
              </div>
            </div>

            {#if message}
              <div class="alert alert-info mt-6">
                <span class="text-white">{message}</span>
              </div>
            {/if}

            <div class="form-control mt-8">
              <button type="submit" class="btn btn-primary w-full sm:w-auto text-white" disabled={loading}>
                {#if loading}
                  <span class="loading loading-spinner"></span>
                {/if}
                Update Profile
              </button>
            </div>
          </form>
        {:else}
          <div class="alert alert-warning">
            <span class="text-white">Please log in to view your profile</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
