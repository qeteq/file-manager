import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createBrotliDecompress } from 'zlib';
import { InvalidInputError, CommandFailureError, rethrowIfAbort } from '../errors.js';

const decompress = {
    async exec(args, { signal }) {
        if (args.length !== 2) {
            throw new InvalidInputError('compress: exactly 2 arguments are required');
        }
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
