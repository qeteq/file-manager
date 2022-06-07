import { rm } from 'fs/promises';
import { CommandFailureError, InvalidInputError } from '../errors.js';

const rmCommand = {
    async exec(args) {
        if (args.length !== 1) {
            throw new InvalidInputError('rm: missing argument');
        }

        const [file] = args;
        try {
            await rm(file);
        } catch (error) {
            throw new CommandFailureError(error.message, { cause: error });
        }
    },
};

export { rmCommand as rm };
