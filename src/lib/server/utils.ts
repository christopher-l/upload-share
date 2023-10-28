import { getPathForToken } from "./tokens";

export async function getFilePath(params: { token: string; path: string }): Promise<string | null> {
	let path = await getPathForToken(params.token);
	if (params.path) {
		path += '/' + params.path;
	}
	return path;
}
