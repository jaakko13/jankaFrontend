import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = locals.session;
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { date, timeSlot, details } = await request.json();
        
        const { data, error } = await supabase.rpc('create_appointment', {
            appointment_date: new Date(date),
            time_slot: timeSlot,
            details
        });

        if (error) {
            if (error.message.includes('Time slot is not available')) {
                return new Response('Time slot is not available', { status: 409 });
            }
            throw error;
        }

        return json(data[0]);
    } catch (error) {
        console.error('Failed to create appointment:', error);
        return new Response('Failed to create appointment', { status: 500 });
    }
};

export const GET: RequestHandler = async ({ locals }) => {
    const session = locals.session;
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('appointment')
            .select('*')
            .order('date');

        if (error) throw error;
        return json(data);
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        return new Response('Failed to fetch appointments', { status: 500 });
    }
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
    const session = locals.session;
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { id, status, date, timeSlot, details } = await request.json();

        const { data, error } = await supabase.rpc('update_appointment', {
            appointment_id: id,
            new_date: date ? new Date(date) : null,
            new_time_slot: timeSlot,
            new_details: details,
            new_status: status
        });

        if (error) {
            if (error.message.includes('Time slot is not available')) {
                return new Response('Time slot is not available', { status: 409 });
            }
            if (error.message.includes('Appointment not found')) {
                return new Response('Appointment not found', { status: 404 });
            }
            throw error;
        }

        return json(data[0]);
    } catch (error) {
        console.error('Failed to update appointment:', error);
        return new Response('Failed to update appointment', { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
    const session = locals.session;
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { id } = await request.json();

        const { data, error } = await supabase
            .from('appointment')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.message.includes('Appointment not found')) {
                return new Response('Appointment not found', { status: 404 });
            }
            throw error;
        }

        return json(data);
    } catch (error) {
        console.error('Failed to delete appointment:', error);
        return new Response('Failed to delete appointment', { status: 500 });
    }
};
