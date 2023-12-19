import { DATA_DIR } from '$env/static/private';
import { lstat, readFile, writeFile } from 'fs/promises';
import type { ErrnoException } from './types';

const TOKENS_FILE = `${DATA_DIR}/tokens.json`;

/**
 * Root-level file entries are translated to tokens. Public access to root-level entries is allowed
 * only via token.
 *
 * A map of tokens and root-level paths is kept on disk on in memory. Missing tokens are
 * automatically generated and saved to the map.
 */

interface TokenEntry {
	name: string;
	date: string;
}

/** Maps tokens to files and directories in the root directory. */
type Tokens = { [token: string]: TokenEntry };

/**
 * In-memory representation of the tokens file.
 *
 * Consistency is achieved by modifying the object yielded by this promise in place, so the result
 * of `await getTokens()` will always be up-to-date.
 */
let cachedTokens: Promise<Tokens> | null = null;

export async function listTokens(): Promise<({ token: string } & TokenEntry)[]> {
	const tokens = await getTokens();
	return Object.entries(tokens).map(([token, entry]) => ({ token, ...entry }));
}

export async function getTokenEntry(token: string): Promise<TokenEntry | null> {
	const tokens = await getTokens();
	return tokens[token] ?? null;
}

/**
 * Returns the root-level path that corresponds to the given token.
 */
export function getPathForTokenEntry(entry: TokenEntry): string {
	return `${entry.date} ${entry.name}`;
}

export async function addToken(name: string): Promise<TokenEntry> {
	const entry = { name, date: new Date().toISOString() };
	const tokens = await getTokens();
	tokens[generateToken()] = entry;
	void writeTokensFile();
	return entry;
}

/**
 * Deletes the token if it exists.
 *
 * @returns the deleted token entry or null if the no entry for the given token existed
 */
export async function deleteToken(token: string): Promise<TokenEntry | null> {
	const tokens = await getTokens();
	const entry = tokens[token];
	if (entry) {
		delete tokens[token];
		void writeTokensFile();
	}
	return entry ?? null;
}

/**
 * Generates a new token suitable as URL path component.
 */
function generateToken(): string {
	const length = 10;
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	const base64 = btoa(String.fromCharCode(...bytes));
	return base64.replaceAll('/', '-').replaceAll('=', '');
}

/**
 * Returns the cached tokens map.
 *
 * When first called, reads the map from disk.
 */
async function getTokens(): Promise<Tokens> {
	if (!cachedTokens) {
		cachedTokens = readTokensFile();
	}
	return cachedTokens;
}

/**
 * Reads the tokens map from disk.
 *
 * Returns an empty object if there is no tokens file yet. The file will be created on the next
 * invocation of `writeTokensFile`.
 */
async function readTokensFile(): Promise<Tokens> {
	try {
		await lstat(TOKENS_FILE);
	} catch (e) {
		if ((e as ErrnoException).code === 'ENOENT') {
			return {};
		}
		throw e;
	}
	const fileContent = await readFile(TOKENS_FILE, { encoding: 'utf-8' });
	return JSON.parse(fileContent);
}

/**
 * Write the current state of `cachedTokens` to disk.
 */
async function writeTokensFile(): Promise<void> {
	await writeFile(TOKENS_FILE, JSON.stringify(await cachedTokens, null, 2), { encoding: 'utf-8' });
}
