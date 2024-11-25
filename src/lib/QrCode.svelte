<!-- Adapted from https://github.com/JonasJs/svelte-qrcode -->

<script lang="ts">
	import { default as QrCode } from 'qrious';
	import { onMount } from 'svelte';

	interface Props {
		errorCorrection?: CorrectionLevel;
		background?: string;
		color?: string;
		size?: number;
		value?: string;
		padding?: number;
		className?: string;
	}

	let {
		errorCorrection = 'L',
		background = '#fff',
		color = '#000',
		size = 200,
		value = '',
		padding = 0,
		className = 'qrcode'
	}: Props = $props();

	let image = $state('');
	let qrCode: QrCode;

	function generateQrCode() {
		qrCode.set({
			background,
			foreground: color,
			level: errorCorrection,
			padding,
			size,
			value
		});

		image = qrCode.toDataURL('image/jpeg');
	}

	export function getImage() {
		return image;
	}

	onMount(() => {
		qrCode = new QrCode();
		if (value) {
			generateQrCode();
		}
	});

	$effect(() => {
		if (value && qrCode) {
			generateQrCode();
		}
	});
</script>

<img src={image} alt={value} class={className} />
