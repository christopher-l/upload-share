import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import { parse } from 'url';

/**
 * Checks if the user provided a valid upload token via cookies or URL parameter.
 * 
 * If the token was provided via URL parameter, also sets the cookie.
 */
export function hasValidUploadToken(request: Request, cookies: Cookies): boolean {
	if (!env.UPLOAD_TOKEN) {
		return false;
	}
	if (cookies.get('token') === env.UPLOAD_TOKEN) {
		return true;
	}
	const url = parse(request.url, true);
	if (url.query.token === env.UPLOAD_TOKEN) {
		cookies.set('token', url.query.token);
		return true;
	}
	return false;
}
