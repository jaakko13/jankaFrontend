<script lang="ts">
  import { user } from '$lib/auth';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import type { Appointment } from '$lib/server/db/schema';
  
  let selectedDate = new Date();
  let appointmentTime = '09:00';
  let appointmentDetails = '';
  let upcomingAppointments: Appointment[] = [];
  let isLoading = false;
  let bookingError = '';  let currentUser: any;
  // Subscribe to user changes and handle session
  user.subscribe(async (value) => {
    currentUser = value;
    if (value) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        fetchAppointments();
      }
    }
  });

  // Helper function to format date as DD/MM/YYYY
  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Helper function to format date as YYYY-MM-DD for input value
  function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  onMount(async () => {
    await fetchAppointments();
  });  async function fetchAppointments() {
    try {
      if (!currentUser?.id) {
        upcomingAppointments = [];
        return;
      }

      // Get current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        upcomingAppointments = [];
        return;
      }
      
      const { data, error } = await supabase
        .from('appointment')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date');

      if (error) throw error;
      upcomingAppointments = data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      upcomingAppointments = [];
    }
  }

  function handleDateSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    selectedDate = input.valueAsDate || new Date();
  }

  async function handleBookAppointment() {
    try {
      if (!currentUser) {
        bookingError = 'Please log in to book appointments';
        return;
      }

      isLoading = true;
      bookingError = '';
      
      const { data, error } = await supabase
        .from('appointment')
        .insert({
          user_id: currentUser.id, // Add the user ID
          date: selectedDate.toISOString(),
          time_slot: appointmentTime,
          details: appointmentDetails,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '23505') { // Unique violation
          throw new Error('This time slot is already booked');
        }
        if (error.code === '42501') { // RLS policy violation
          throw new Error('Please log in to book appointments');
        }
        throw new Error(error.message);
      }

      if (data) {
        upcomingAppointments = [...upcomingAppointments, data];
        
        // Reset form
        appointmentDetails = '';
        
        // Show success message
        alert('Appointment booked successfully!');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      bookingError = error instanceof Error ? error.message : 'Failed to book appointment';
    } finally {
      isLoading = false;
    }
  }

  async function handleCancelAppointment(id: number) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointment')
        .delete()
        .eq('id', id);

      if (error) throw error;

      upcomingAppointments = upcomingAppointments.filter(apt => apt.id !== id);
      alert('Appointment cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    }
  }

  async function handleUpdateAppointment(appointment: Appointment) {
    try {
      const { data, error } = await supabase.rpc('update_appointment', {
        appointment_id: appointment.id,
        new_status: appointment.status,
        new_date: null,
        new_time_slot: null,
        new_details: null
      });

      if (error) throw error;

      if (data) {
        const updatedAppointment = data[0];
        upcomingAppointments = upcomingAppointments.map(apt => 
          apt.id === updatedAppointment.id ? updatedAppointment : apt
        );
        
        alert('Appointment updated successfully!');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  }

  // Subscribe to realtime changes
  onMount(() => {
    fetchAppointments();

    const appointmentsSubscription = supabase
      .channel('appointments')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointment' 
        }, 
        payload => {
          if (payload.eventType === 'INSERT') {
            const newAppointment = payload.new as Appointment;
            upcomingAppointments = [...upcomingAppointments, newAppointment];
          } else if (payload.eventType === 'DELETE') {
            upcomingAppointments = upcomingAppointments.filter(apt => apt.id !== payload.old.id);
          } else if (payload.eventType === 'UPDATE') {
            const updatedAppointment = payload.new as Appointment;
            upcomingAppointments = upcomingAppointments.map(apt =>
              apt.id === updatedAppointment.id ? updatedAppointment : apt
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsSubscription);
    };
  });
</script>

<div class="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-8 sm:mt-16 max-w-[95vw]">
  <div class="flex flex-col lg:flex-row gap-4 sm:gap-8">
    <!-- Calendar Section -->
    <div class="flex-1">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-6">
          <h2 class="card-title text-lg sm:text-xl mb-4">Select Date</h2>
          <!-- DaisyUI Calendar -->
          <div class="join w-full">
            <input
              type="date"
              class="input input-bordered join-item flex-1 min-w-0 text-sm sm:text-base"
              value={formatDateForInput(selectedDate)}
              on:change={handleDateSelect}
              min={formatDateForInput(new Date())}
              placeholder="DD/MM/YYYY"
            />
            <select 
              class="select select-bordered join-item flex-none text-sm sm:text-base"
              bind:value={appointmentTime}
            >
              {#each timeSlots as time}
                <option value={time}>{time}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Details Section -->
    <div class="flex-1">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-6">
          <h2 class="card-title text-lg sm:text-xl mb-4">Appointment Details</h2>
            <div class="form-control">
            <label class="label" for="datetime-display">
              <span class="label-text">Selected Date & Time</span>
            </label>
            <input 
              id="datetime-display"
              type="text" 
              class="input input-bordered text-sm sm:text-base" 
              readonly 
              value={`${formatDate(selectedDate)} at ${appointmentTime}`} 
            />
          </div>

          <div class="form-control mt-4">
            <label class="label" for="appointment-notes">
              <span class="label-text">Additional Notes</span>
            </label>
            <textarea 
              id="appointment-notes"
              class="textarea textarea-bordered h-24 text-sm sm:text-base" 
              placeholder="Add any specific requirements or notes"
              bind:value={appointmentDetails}
            ></textarea>
          </div>

          <div class="card-actions justify-end mt-6">
            <button 
              class="btn btn-primary w-full sm:w-auto"
              disabled={isLoading} 
              on:click={handleBookAppointment}
            >
              {#if isLoading}
                <span class="loading loading-spinner"></span>
                Booking...
              {:else}
                Book Appointment
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error Message -->
  {#if bookingError}
    <div class="alert alert-error mt-4 text-sm sm:text-base">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{bookingError}</span>
    </div>
  {/if}

  <!-- Upcoming Appointments Section -->
  <div class="mt-4 sm:mt-8">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body p-2 sm:p-6">
        <h2 class="card-title text-lg sm:text-xl mb-2 sm:mb-4 px-2">Upcoming Appointments</h2>
        {#if upcomingAppointments.length > 0}
          <div class="overflow-x-auto w-full -mx-2 px-2">
            <div class="inline-block min-w-full align-middle">
              <table class="table table-compact w-full">
                <thead>
                  <tr class="text-xs md:text-sm">
                    <th class="whitespace-nowrap px-2 sm:px-4">Date</th>
                    <th class="whitespace-nowrap px-2 sm:px-4">Time</th>
                    <th class="whitespace-nowrap px-2 sm:px-4">Status</th>
                    <th class="whitespace-nowrap px-2 sm:px-4 hidden md:table-cell">Details</th>
                    <th class="whitespace-nowrap px-2 sm:px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {#each upcomingAppointments as appointment}
                    <tr class="text-xs md:text-sm">
                      <td class="whitespace-nowrap px-2 sm:px-4">{formatDate(new Date(appointment.date))}</td>
                      <td class="whitespace-nowrap px-2 sm:px-4">{appointment.timeSlot}</td>
                      <td class="px-2 sm:px-4">
                        <div class="badge badge-sm md:badge-md badge-{appointment.status === 'pending' ? 'warning' : 
                                              appointment.status === 'confirmed' ? 'success' : 
                                              'error'}">
                          {appointment.status}
                        </div>
                      </td>                      <td class="hidden md:table-cell px-2 sm:px-4">
                        <div class="max-w-xs overflow-hidden text-ellipsis">
                          {appointment.details || '-'}
                        </div>
                      </td>
                      <td class="px-2 sm:px-4">
                        <button class="btn btn-error btn-xs sm:btn-sm"
                          on:click={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {:else}
          <div class="text-center py-4 text-sm sm:text-base">
            No upcoming appointments
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
