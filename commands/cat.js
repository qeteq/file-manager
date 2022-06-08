import { createReadStream } from 'fs';
import { realpath, stat } from 'fs/promises';
import { finished } from 'stream/promises';
import {
    CommandAbortError,
    CommandFailureError,
    InvalidInputError,
    rethrowIf,
    rethrowIfAbort,
} from '../errors.js';

const cat = {
    async exec(args, { signal, output }) {
        if (args.length === 0) {
            throw new InvalidInputError('cat: argument is required');
        }

        const paths = await Promise.all(
            args.map(async (path) => {
                try {
                    const fileStat = await stat(path);
                    if (fileStat.isDirectory() || fileStat.isSocket()) {
                        throw new CommandFailureError(`cat: ${path} is invalid target`);
                    }

                    return await realpath(path);
                } catch (error) {
                    rethrowIf(error, CommandFailureError);
                    if (error.code === 'EACCES') {
                        throw new CommandFailureError(
                            `cat: ${path}: permission denied`
                        );
                    }
                    if (error.code === 'ENOENT') {
                        throw new CommandFailureError(`cat: ${path}: no such file`);
                    }
                    throw new CommandFailureError(error.message, { cause: error });
                }
            })
        );

        while (paths.length) {
            const path = paths.shift();
            /** @type {NodeJS.ReadStream} */
            let input;
            try {
                input = createReadStream(path);
                // using default pipe because streams/promises pipeline closes
                // output stream on completion
                input.pipe(output, { end: false });
                signal.addEventListener('abort', () => {
                    input.destroy(new CommandAbortError());
                });
                await finished(input);
            } catch (error) {
                rethrowIfAbort(error);
                throw new CommandFailureError(error.message, { cause: error });
            }
        }
    },
};

export { cat };
