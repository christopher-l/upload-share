let cleanupTasks: { [key: string]: () => void } = {};

export function registerCleanup(key: string, f: () => void) {
	cleanupTasks[key] = f;
}

if (process.env.registrationDone !== 'true') {
	process.on('exit', () => Object.values(cleanupTasks).forEach((task) => task()));

	// Make signals trigger our exit hook.
	process.on('SIGINT', () => process.exit());
	process.on('SIGUSR1', () => process.exit());
	process.on('SIGUSR2', () => process.exit());
	process.on('SIGTERM', () => process.exit());

	process.env.registrationDone = 'true';
}
