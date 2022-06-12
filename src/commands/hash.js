import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { CommandFailureError, rethrowIfAbort } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';

const hash = {
    async exec(args, { signal, writeLine }) {
        validateArgs({ length: 1 }, args);

        const hasher = createHash('sha256');
        const [filePath] = args;
        try {
            const input = createReadStream(filePath);
            await pipeline(input, hasher, { signal });
        } catch (error) {
            rethrowIfAbort(error);
            throw CommandFailureError.causedBy(error);
        }

        writeLine(hasher.digest('hex'));
    },
};

export { hash };
