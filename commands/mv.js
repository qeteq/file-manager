import { rename } from 'fs/promises';
import { basename, join, resolve } from 'path';
import { CommandFailureError, InvalidInputError } from '../errors.js';

const mv = {
    async exec(args) {
        if (args.length !== 2) {
            throw new InvalidInputError('mv: exactly 2 arguments are required');
        }

        const [from, toFolder] = args;
        const to = join(toFolder, basename(resolve(from)));

        // TODO: validate `to` does not exist

        try {
            await rename(from, to);
        } catch (error) {
            throw new CommandFailureError(error.message, { cause: error });
        }
    },
};

export { mv };
