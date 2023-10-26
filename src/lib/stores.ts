import { writable } from 'svelte/store';

/** The title displayed in the top nav bar. */
export const title = writable<string>();
/** The href of the back button in the top nav bar. When null, the button will be hidden. */
export const backTarget = writable<string | null>();
