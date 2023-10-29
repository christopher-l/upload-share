import { env } from '$env/dynamic/private';
import { DISABLE_AUTHENTICATION } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import { parse } from 'url';

/**
 * Checks if the user provided a valid upload token via cookies or URL parameter.
 *
 * If the user has a valid token sets/renews the cookie.
 */
export function hasValidUploadToken(request: Request, cookies: Cookies): boolean {
	if (DISABLE_AUTHENTICATION) {
		return true;
	}
	if (!env.UPLOAD_TOKEN) {
		return false;
	}
	if (cookies.get('token') === env.UPLOAD_TOKEN) {
		// Renew cookie to prolong expiration date.
		cookies.set('token', env.UPLOAD_TOKEN, { expires: new Date(2147483647000) });
		return true;
	}
	const url = parse(request.url, true);
	if (url.query.token === env.UPLOAD_TOKEN) {
		cookies.set('token', url.query.token, { expires: new Date(2147483647000) });
		return true;
	}
	return false;
}
