export function getPath(params: { token: string; path: string }): string {
	let path = params.token;
	if (params.path) {
		path += '/' + params.path;
	}
	return path;
}
