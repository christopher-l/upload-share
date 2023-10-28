import { getPathForToken } from './tokens';

export async function getFilePath(params: { token: string; path: string }): Promise<string | null> {
	let path = await getPathForToken(params.token);
	if (
		params.path &&
		// We use an additional '/' character to indicate that we appended the filename for a
		// root-level file to the URL. In this case, the actual file was already indicated by the
		// token and we discard `params.path` (after checking, that it matches the filename
		// indicated by the token).
		params.path !== `/${path}`
	) {
		path += '/' + params.path;
	}
	return path;
}
