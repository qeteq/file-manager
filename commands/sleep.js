import { CommandAbortError, InvalidInputError } from '../errors.js';

const sleep = {
    async exec(args, { signal }) {
        if (args.length === 0) {
            throw new InvalidInputError('sleep: missing argument');
        }

        const ms = args.map(Number).map((a, b) => a + b) * 1000;
        if (Number.isNaN(ms)) {
            throw new InvalidInputError('sleep: invalid arguments');
        }

        if (signal.aborted) return;

        return new Promise((resolve, reject) => {
            const to = setTimeout(resolve, ms);
            signal.addEventListener('abort', () => {
                clearTimeout(to);
                reject(new CommandAbortError());
            });
        });
    },
};

export { sleep };
