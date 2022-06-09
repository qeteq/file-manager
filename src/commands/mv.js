import { rename } from 'fs/promises';
import { basename, join, resolve } from 'path';
import { CommandFailureError } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';
import { validateDoesNotExist } from '../validators/path.js';

const mv = {
    async exec(args) {
        validateArgs({ length: 2 }, args);

        const [from, toFolder] = args;
        const to = join(toFolder, basename(resolve(from)));

        await validateDoesNotExist(to);

        try {
            await rename(from, to);
        } catch (error) {
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { mv };
