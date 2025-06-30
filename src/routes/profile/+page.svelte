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

<div class="min-h-screen bg-gray-100 py-8 text-gray-800">
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-xl">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Your Profile</h2>
        
        {#if $user}
          <div class="flex items-center gap-4 mb-6">
            <div class="relative">
              <div class="w-24 h-24 rounded-full ring-4 ring-blue-500 ring-offset-2">
                <img class="w-full h-full rounded-full object-cover" src={`https://api.dicebear.com/7.x/initials/svg?seed=${$user.email}`} alt="avatar" />
              </div>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">{$user.email}</h3>
              <p class="text-gray-600">Member since {new Date($user.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <form on:submit|preventDefault={updateProfile} class="space-y-6">
            <div class="relative py-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Personal Information</span>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="firstName" class="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input 
                  type="text" 
                  id="firstName" 
                  bind:value={firstName} 
                  class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm" 
                  placeholder="Enter your first name"
                />
              </div>

              <div class="space-y-1">
                <label for="lastName" class="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input 
                  type="text" 
                  id="lastName" 
                  bind:value={lastName} 
                  class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm" 
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div class="relative py-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Business Information</span>
              </div>
            </div>

            <div class="space-y-1">
              <label for="businessAddress" class="block text-sm font-medium text-gray-700">
                Business Address
              </label>
              <input 
                type="text" 
                id="businessAddress" 
                bind:value={businessAddress} 
                class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm" 
                placeholder="Enter your business Address"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="yTunnus" class="block text-sm font-medium text-gray-700">
                  Y-tunnus
                  <span class="text-sm text-gray-500 ml-1">(Business ID)</span>
                </label>
                <input 
                  type="text" 
                  id="yTunnus" 
                  bind:value={yTunnus} 
                  class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm" 
                  placeholder="1234567-8"
                  pattern="\d{7}-\d"
                  title="Format: 1234567-8"
                />
              </div>

              <div class="space-y-1">
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  bind:value={phoneNumber} 
                  class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm" 
                  placeholder="+358 40 123 4567"
                />
              </div>
            </div>

            {#if message}
              <div class="mt-6 rounded-md bg-blue-50 p-4">
                <p class="text-sm text-blue-700">{message}</p>
              </div>
            {/if}

            <div class="mt-8 flex justify-start">
              <button 
                type="submit" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {#if loading}
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                {/if}
                Update Profile
              </button>
            </div>
          </form>
        {:else}
          <div class="rounded-md bg-yellow-50 p-4">
            <p class="text-sm font-medium text-yellow-800">Please log in to view your profile</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
