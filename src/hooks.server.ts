import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { supabase } from '$lib/supabase';
import { redirect } from '@sveltejs/kit';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	// Get the auth token from the cookie
	const token = event.cookies.get('sb-token');

	if (token) {
		// Set the auth token in the supabase client
		const { data: { user } } = await supabase.auth.getUser(token);
		event.locals.user = user;
	} else {
		event.locals.user = null;
	}

	// Protect routes that require authentication
	const protectedRoutes = ['/profile'];
	if (protectedRoutes.includes(event.url.pathname) && !event.locals.user) {
		throw redirect(303, '/login');
	}

	return resolve(event);
};

export const handle = sequence(handleParaglide, handleAuth);
