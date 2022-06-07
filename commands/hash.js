import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { CommandFailureError, InvalidInputError, rethrowIfAbort } from '../errors.js';

const hash = {
    async exec(args, { signal, writeLine }) {
        if (args.length !== 1) {
            throw new InvalidInputError('hash: exactly 1 argument is required');
        }
        const [filePath] = args;

        const hasher = createHash('sha256');
        try {
            const input = createReadStream(filePath);
            await pipeline(input, hasher, { signal });
        } catch (error) {
            rethrowIfAbort(error);
            throw new CommandFailureError(error.message, { cause: error });
        }

        writeLine(hasher.digest('hex'));
    },
};

export { hash };
