import { writable } from 'svelte/store';

/** The href of the back button in the top nav bar. When null, the button will be hidden. */
export const backTarget = writable<string | null>();

/** The href of the download button in the top nav bar. When null, the button will be hidden. */
export const downloadTarget = writable<string | null>();