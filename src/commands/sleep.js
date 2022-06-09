import { CommandAbortError, InvalidInputError } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';

const sleep = {
    async exec(args, { signal }) {
        validateArgs({ length: { min: 1 } }, args);

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
