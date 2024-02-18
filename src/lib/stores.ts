import { writable } from 'svelte/store';

/** The href of the back button in the top nav bar. When null, the button will be hidden. */
export const backTarget = writable<string | null>();

/** The href of the download button in the top nav bar. When null, the button will be hidden. */
export const downloadTarget = writable<string | null>();

/** The href of the download button in the top nav bar for folders. The href is
 * a link to an endpoint that creates the archive when called and returns the
 * archive's download link. */
export const createArchiveTarget = writable<string | null>();

/**
 * The user has sent files to the app as share target and should now select a destination folder.
 */
export const selectDestination = writable<boolean>(false);
