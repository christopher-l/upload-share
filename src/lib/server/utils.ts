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

/**
 * Returns the download HREF for the given file.
 * 
 * @param token The root entry's download token.
 * @param filePath The file's complete path as provided by the root `+layout.server.ts`.
 */
export function getDownloadHref(
	token: string,
	filePath: string[]
): string {
	const [rootPath, ...subPath] = filePath;
	if (subPath.length > 0) {
		return `/download/${token}/${subPath.join('')}`;
	} else {
		// We append the filename to the URL, so the browser has the correct name when downloading
		// and so it will have the correct extension when used in `src` tags. The `download`
		// endpoint needs to strip this when received. We use the additional '/' character to
		// identify this scenario.
		return `/download/${token}//${rootPath}`;
	}
}