export function getPath(params: { link: string; path: string }): string {
	let path = params.link;
	if (params.path) {
		path += '/' + params.path;
	}
	return path;
}
