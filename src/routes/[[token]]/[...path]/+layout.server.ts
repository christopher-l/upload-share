import { hasValidUploadToken } from '$lib/server/authentication';
import { getEntryType, listDir } from '$lib/server/filesystem';
import { getActualPath, getDownloadHref, getVirtualPath } from '$lib/server/utils';
import type { FileListEntry, NavLinks } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { LayoutParams, LayoutServerLoad } from './$types';

export const load: LayoutServerLoad<{
	/** Whether the user presented a valid upload token. */
	hasUploadToken: boolean;
	/**
	 * The path of the directory or file referenced by the URL path relative to the root directory.
	 */
	virtalPath: string[];
	/** The entry type of the item referenced by the URL path. */
	entryType: 'file' | 'directory';
	/** Links for adjacent-page navigation. */
	navLinks: NavLinks | null;
	downloadHref: string | null;
}> = async ({ params, request, cookies }) => {
	const hasUploadToken = hasValidUploadToken(request, cookies);
	if (!hasUploadToken && !params.token) {
		throw error(401);
	}
	const virtalPath = await getVirtualPath(params);
	const actualPath = await getActualPath(params);
	const entryType = await getEntryType(actualPath);
	if (!entryType) {
		throw error(404);
	}
	return {
		hasUploadToken,
		virtalPath,
		entryType,
		navLinks: entryType === 'file' ? await getNavLinks({ params, actualPath }) : null,
		downloadHref:
			(params.token &&
				(await getDownloadHref(params.token, actualPath, virtalPath, entryType === 'directory'))) ??
			null
	};
};

async function getNavLinks({
	params,
	actualPath
}: {
	params: LayoutParams;
	actualPath: string[];
}): Promise<NavLinks | null> {
	if (actualPath.length < 2) {
		return null;
	}
	const parentPath = actualPath.slice(0, -1);
	const parentFiles = (await listDir(parentPath)).filter(
		(entry) => entry.type !== 'inode/directory'
	);
	const [itemName] = actualPath.slice(-1);
	const itemIndex = parentFiles.findIndex((file) => file.name === itemName);
	return {
		previous: getItemLink(parentFiles[itemIndex - 1], params, parentPath),
		next: getItemLink(parentFiles[itemIndex + 1], params, parentPath),
		index: itemIndex,
		total: parentFiles.length
	};
}

function getItemLink(
	item: FileListEntry | undefined,
	params: LayoutParams,
	parentPath: string[]
): string | null {
	if (item) {
		return '/' + [params.token, ...parentPath.slice(1), item.name].join('/');
	} else {
		return null;
	}
}
