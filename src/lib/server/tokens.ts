import { lstat, readFile, writeFile } from 'fs/promises';

/** Maps tokens to files and directories in the root directory. */
type Tokens = { [token: string]: string };

let cachedTokens: Promise<Tokens> | null = null;

const tokensFile = '.tokens.json';

export async function getPathForToken(token: string): Promise<string> {
	const tokens = await getTokens();
	return tokens[token];
}

export async function getToken(path: string): Promise<string> {
	const tokens = await getTokens();
	let token = Object.entries(tokens).find(([, p]) => path === p)?.[0];
	if (!token) {
		token = generateToken();
		tokens[token] = path;
		void writeTokensFile(tokens);
	}
	return token;
}

function generateToken(): string {
	const length = 20;
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	const base64 = btoa(String.fromCharCode(...bytes));
	return base64.replace(/\//g, '-').replace(/=/g, '');
}

async function getTokens(): Promise<Tokens> {
	if (!cachedTokens) {
		cachedTokens = readTokensFile();
	}
	return cachedTokens;
}

async function readTokensFile(): Promise<Tokens> {
	try {
		await lstat(tokensFile);
	} catch (e) {
		if (e.code === 'ENOENT') {
			return {};
		}
		throw e;
	}
	const fileContent = await readFile(tokensFile, { encoding: 'utf-8' });
	return JSON.parse(fileContent);
}

async function writeTokensFile(tokens: Tokens): Promise<void> {
	cachedTokens = Promise.resolve(tokens);
	await writeFile(tokensFile, JSON.stringify(tokens, null, 2), { encoding: 'utf-8' });
}
