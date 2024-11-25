// Adapted from https://codesandbox.io/embed/4mrnhq?view=Editor+%2B+Preview&module=%2Fjs%2Fmodal.js

export function showModal(dialog: HTMLDialogElement) {
	const { documentElement: html } = document;
	const scrollbarWidth = getScrollbarWidth();
	if (scrollbarWidth) {
		html.style.setProperty('--pico-scrollbar-width', `${scrollbarWidth}px`);
	}
	html.classList.add('modal-is-open', 'modal-is-opening');
	setTimeout(() => {
		html.classList.remove('modal-is-opening');
	}, 400);
	dialog.showModal();
}

export function closeModal(dialog: HTMLDialogElement): Promise<void> {
	const { documentElement: html } = document;
	html.classList.add('modal-is-closing');
	return new Promise((resolve) =>
		setTimeout(() => {
			html.classList.remove('modal-is-open', 'modal-is-closing');
			html.style.removeProperty('--pico-scrollbar-width');
			dialog.close();
			resolve();
		}, 400)
	);
}

const getScrollbarWidth = () => {
	const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
	return scrollbarWidth;
};
