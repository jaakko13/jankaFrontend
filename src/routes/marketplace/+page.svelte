<script lang="ts">
  import { enhance } from '$app/forms';

  let formData = {
    businessName: '',
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

  const categories = [
    'Retail',
    'Restaurant',
    'Professional Services',
    'Healthcare',
    'Beauty & Wellness',
    'Entertainment',
    'Other'
  ];

  const handleSubmit = async (e: SubmitEvent) => {
    submitting = true;
    error = '';
    success = false;

    try {
      // Here you would typically make an API call to save the business data
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      success = true;
      formData = {
        businessName: '',
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

<div class="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-base-content mb-4">Join Our Marketplace</h1>
      <p class="text-lg text-base-content/80">
        List your business and reach more customers through our platform
      </p>
    </div>    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="form-control w-full">
              <label for="businessName" class="label">
                <span class="label-text">Business Name*</span>
              </label>              <input
                type="text"
                id="businessName"
                bind:value={formData.businessName}
                class="input input-bordered w-full"
                required
              />
            </div>
            
            <div class="form-control w-full">
              <label for="yTunnus" class="label">
                <span class="label-text">Y-tunnus (Business ID)*</span>
                <span class="label-text-alt">Format: 1234567-8</span>
              </label>
              <input
                type="text"
                id="yTunnus"
                bind:value={formData.yTunnus}
                class="input input-bordered w-full"
                pattern="^[0-9]{7}-[0-9]$"
                placeholder="1234567-8"
                required
              />
            </div>
            
            <div class="form-control w-full">
              <label for="ownerName" class="label">
                <span class="label-text">Owner Name*</span>
              </label>
              <input
                type="text"
                id="ownerName"
                bind:value={formData.ownerName}
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control w-full">
              <label for="email" class="label">
                <span class="label-text">Email*</span>
              </label>
              <input
                type="email"
                id="email"
                bind:value={formData.email}
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control w-full">
              <label for="phone" class="label">
                <span class="label-text">Phone Number*</span>
              </label>
              <input
                type="tel"
                id="phone"
                bind:value={formData.phone}
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control w-full sm:col-span-2">
              <label for="category" class="label">
                <span class="label-text">Business Category*</span>
              </label>
              <select
                id="category"
                bind:value={formData.category}
                class="select select-bordered w-full"
                required
              >
                <option value="">Select a category</option>
                {#each categories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>

            <div class="form-control w-full sm:col-span-2">
              <label for="address" class="label">
                <span class="label-text">Business Address*</span>
              </label>
              <input
                type="text"
                id="address"
                bind:value={formData.address}
                class="input input-bordered w-full"
                required
              />
            </div>

            <div class="form-control w-full sm:col-span-2">
              <label for="website" class="label">
                <span class="label-text">Website (optional)</span>
              </label>
              <input
                type="url"
                id="website"
                bind:value={formData.website}
                class="input input-bordered w-full"
                placeholder="https://"
              />
            </div>

            <div class="form-control w-full sm:col-span-2">
              <label for="description" class="label">
                <span class="label-text">Business Description*</span>
              </label>
              <textarea
                id="description"
                bind:value={formData.description}
                class="textarea textarea-bordered h-32"
                required
              ></textarea>
            </div>
          </div>          {#if error}
            <div class="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          {/if}

          {#if success}
            <div class="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Your business information has been submitted successfully!</span>
            </div>
          {/if}

          <div class="card-actions justify-center">
            <button
              type="submit"
              class="btn btn-primary btn-lg"
              disabled={submitting}
            >
              {#if submitting}
                <span class="loading loading-spinner"></span>
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
</div>
