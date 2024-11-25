// Adapted from https://github.com/neocotic/qrious/issues/101#issuecomment-348857515

type CorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface Options {
	background?: string;
	backgroundAlpha?: number;
	foreground?: string;
	foregroundAlpha?: number;
	level?: CorrectionLevel;
	padding?: number;
	size?: number;
	value?: string;
}

interface QRious {
	new (options?: Options): QrCodeType;
	set(options: Options): void;
	toDataURL(mime?: string): string;
}

declare module 'qrious' {
	export = QRious;
}

declare var QRious;
