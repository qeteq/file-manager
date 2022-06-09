import { createReadStream } from 'fs';
import { finished } from 'stream/promises';
import {
    CommandAbortError,
    CommandFailureError,
    InvalidInputError,
    rethrowIfAbort,
} from '../errors.js';
import { validateStatType } from '../validators/path.js';

const cat = {
    async exec(args, { signal, output }) {
        if (args.length === 0) {
            throw new InvalidInputError('cat: argument is required');
        }

        const paths = args.slice(0);

        while (paths.length) {
            const path = paths.shift();
            await validateStatType(path, ['file', 'blockDevice', 'characterDevice']);

            try {
                const input = createReadStream(path);
                // using default pipe because streams/promises pipeline closes
                // output stream on completion
                input.pipe(output, { end: false });
                signal.addEventListener('abort', () => {
                    input.destroy(new CommandAbortError());
                });
                await finished(input);
            } catch (error) {
                rethrowIfAbort(error);
                throw CommandFailureError.causedBy(error);
            }
        }
    },
};

export { cat };
