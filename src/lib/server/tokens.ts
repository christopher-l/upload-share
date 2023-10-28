import { TOKENS_FILE } from '$env/static/private';
import { lstat, readFile, writeFile } from 'fs/promises';

/**
 * Root-level file entries are translated to tokens. Public access to root-level entries is allowed
 * only via token.
 *
 * A map of tokens and root-level paths is kept on disk on in memory. Missing tokens are
 * automatically generated and saved to the map.
 */

/** Maps tokens to files and directories in the root directory. */
type Tokens = { [token: string]: string | undefined };

/**
 * In-memory representation of the tokens file.
 *
 * Consistency is achieved by modifying the object yielded by this promise in place, so the result
 * of `await getTokens()` will always be up-to-date.
 */
let cachedTokens: Promise<Tokens> | null = null;

/**
 * Returns the root-level path that corresponds to the given token.
 *
 * Returns `null` if the given token is not mapped.
 */
export async function getPathForToken(token: string): Promise<string | null> {
	const tokens = await getTokens();
	return tokens[token] ?? null;
}

/**
 * Returns the token that corresponds to the given root-level path.
 *
 * If the given path has no token yet, generates a token and saves it to the map.
 */
export async function getToken(path: string): Promise<string> {
	const tokens = await getTokens();
	let token = Object.entries(tokens).find(([, p]) => path === p)?.[0];
	if (!token) {
		token = generateToken();
		tokens[token] = path;
		void writeTokensFile();
	}
	return token;
}

/**
 * Generates a new token suitable as URL path component.
 */
function generateToken(): string {
	const length = 20;
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
		if (e.code === 'ENOENT') {
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
