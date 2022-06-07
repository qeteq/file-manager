import { createReadStream } from 'fs';
import { realpath, stat } from 'fs/promises';
import { pipeline } from 'stream/promises';
import {
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
            let input;
            try {
                input = createReadStream(path);
                await pipeline(input, output, { signal, end: false });
            } catch (error) {
                rethrowIfAbort(error);
                throw new CommandFailureError(error.message, { cause: error });
            }
        }
    },
};

export { cat };
