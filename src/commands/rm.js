import { rm } from 'fs/promises';
import { CommandFailureError } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';

const rmCommand = {
    async exec(args) {
        validateArgs({ length: 1 }, args);

        const [file] = args;
        try {
            await rm(file);
        } catch (error) {
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { rmCommand as rm };
