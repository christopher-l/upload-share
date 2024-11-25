import { writable } from 'svelte/store';

/**
 * The user has sent files to the app as share target and should now select a
 * destination folder.
 */
export const selectDestination = writable<boolean>(false);
