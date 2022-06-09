import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createBrotliDecompress } from 'zlib';
import { CommandFailureError, rethrowIfAbort } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';

const decompress = {
    async exec(args, { signal }) {
        validateArgs({ length: 2 }, args);

        const [from, to] = args;
        try {
            const input = createReadStream(from);
            const output = createWriteStream(to);
            const compressor = createBrotliDecompress();
            await pipeline(input, compressor, output, { signal });
        } catch (error) {
            rethrowIfAbort(error);
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { decompress };
