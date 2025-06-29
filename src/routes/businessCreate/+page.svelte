<script lang="ts">
  import { enhance } from '$app/forms';
  import { supabase } from '$lib/supabase';

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

    // Validate required fields except phone
    if (!formData.businessName || !formData.yTunnus || !formData.ownerName || !formData.email || !formData.description || !formData.category || !formData.address || !formData.website) {
      error = 'Please fill in all required fields.';
      submitting = false;
      return;
    }

    try {
      const { data, error: dbError } = await supabase.from('vendors').insert([
        {
          business_name: formData.businessName,
          y_tunnus: formData.yTunnus,
          owner_name: formData.ownerName,
          email: formData.email,
          phone: formData.phone || null,
          description: formData.description,
          category: formData.category,
          address: formData.address,
          website: formData.website
        }
      ]);
      if (dbError) throw dbError;
      success = true;
      formData = {
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
    } catch (err) {
      error = 'Failed to submit business information. Please try again.';
    } finally {
      submitting = false;
    }
  };
</script>

<div style="min-height: 100vh; padding-top: 5rem; padding-left: 0; padding-right: 0; padding-bottom: 0; background: #f3f4f6;">
  <div style="max-width: 56rem; margin-left: auto; margin-right: auto;">
    <div style="background-color: var(--base-100, #fff); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border-radius: 0.75rem;">
      <div style="padding: 2rem;">
        <form on:submit|preventDefault={handleSubmit} style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
            <div style="display: flex; flex-direction: column; width: 100%;">
              <label for="businessName" style="margin-bottom: 0.5rem; font-weight: 500;">
                <span>Business Name*</span>
              </label>
              <input
                type="text"
                id="businessName"
                bind:value={formData.businessName}
                style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%;"
                required
              />
            </div>
            <div style="display: flex; flex-direction: column; width: 100%;">
              <label for="yTunnus" style="margin-bottom: 0.5rem; font-weight: 500;">
                <span>Y-tunnus (Business ID)*</span>
                <span style="font-size: 0.875rem; color: #6b7280; margin-left: 0.5rem;">Format: 1234567-8</span>
              </label>
              <input
                type="text"
                id="yTunnus"
                bind:value={formData.yTunnus}
                style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%;"
                pattern="^[0-9]{7}-[0-9]$"
                placeholder="1234567-8"
                required
              />
            </div>
            <div style="display: flex; flex-direction: column; width: 100%;">
              <label for="email" style="margin-bottom: 0.5rem; font-weight: 500;">
                <span>Email*</span>
              </label>
              <input
                type="email"
                id="email"
                bind:value={formData.email}
                style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%;"
                required
              />
            </div>
            <div style="display: flex; flex-direction: column; width: 100%;">
              <label for="phone" style="margin-bottom: 0.5rem; font-weight: 500;">
                <span>Phone Number*</span>
              </label>
              <input
                type="tel"
                id="phone"
                bind:value={formData.phone}
                style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%;"
                required
              />
            </div>
            <div style="display: flex; flex-direction: column; width: 100%; grid-column: span 2 / span 2;">
              <label for="category" style="margin-bottom: 0.5rem; font-weight: 500;">
                <span>Business Category*</span>
              </label>
              <select
                id="category"
                bind:value={formData.category}
                style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%;"
                required
              >
                <option value="">Select a category</option>
                {#each categories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>
            <div style="display: flex; flex-direction: column; width: 100%; grid-column: span 2 / span 2;">
              <label for="address" style="margin-bottom: 0.5rem; font-weight: 500;">
                <span>Business Address*</span>
              </label>
              <input
                type="text"
                id="address"
                bind:value={formData.address}
                style="border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%;"
                required
              />
            </div>
          </div>
          {#if error}
            <div style="background-color: #fee2e2; color: #991b1b; display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 0.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" style="stroke: currentColor; flex-shrink: 0; height: 1.5rem; width: 1.5rem;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          {/if}
          {#if success}
            <div style="background-color: #d1fae5; color: #065f46; display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 0.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" style="stroke: currentColor; flex-shrink: 0; height: 1.5rem; width: 1.5rem;" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
                <span style="display: inline-block; border: 2px solid #fff; border-top: 2px solid #2563eb; border-radius: 50%; width: 1.25rem; height: 1.25rem; animation: spin 1s linear infinite;"></span>
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

<style>
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
