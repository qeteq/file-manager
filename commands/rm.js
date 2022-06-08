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
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { rmCommand as rm };
