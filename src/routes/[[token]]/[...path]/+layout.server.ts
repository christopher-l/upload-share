import { hasValidUploadToken } from '$lib/server/authentication';
import { getEntryType } from '$lib/server/filesystem';
import { getFileList, getFilePath } from '$lib/server/utils';
import type { FileListEntry } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { LayoutParams, LayoutServerLoad } from './$types';

export const load: LayoutServerLoad<{
	/** Whether the user presented a valid upload token. */
	hasUploadToken: boolean;
	/**
	 * The path of the directory or file referenced by the URL path relative to the root directory.
	 */
	filePath: string[];
	/** The entry type of the item referenced by the URL path. */
	entryType: 'file' | 'directory';
	/** Links for adjacent-page navigation. */
	navLinks: Promise<{ next: string | null; previous: string | null } | null>;
}> = async ({ params, request, cookies }) => {
	const hasUploadToken = hasValidUploadToken(request, cookies);
	if (!hasUploadToken && !params.token) {
		throw error(401);
	}
	const filePath = await getFilePath(params);
	const entryType = await getEntryType(filePath);
	if (!entryType) {
		throw error(404);
	}
	return {
		hasUploadToken,
		filePath,
		entryType,
		navLinks: getNavLinks({ params, filePath })
	};
};

async function getNavLinks({
	params,
	filePath
}: {
	params: LayoutParams;
	filePath: string[];
}): Promise<{ next: string | null; previous: string | null } | null> {
	if (filePath.length < 2) {
		return null;
	}
	const parentPath = filePath.slice(0, -1);
	const parentFiles = await getFileList(parentPath, params.token);
	const [itemName] = filePath.slice(-1);
	const itemIndex = parentFiles.findIndex((file) => file.name === itemName);
	return {
		previous: getItemLink(parentFiles[itemIndex - 1], params, parentPath),
		next: getItemLink(parentFiles[itemIndex + 1], params, parentPath)
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
