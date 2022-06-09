import { rename } from 'fs/promises';
import { dirname, join, resolve, sep } from 'path';
import { CommandFailureError, InvalidInputError } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';

const rn = {
    async exec(args) {
        validateArgs({ length: 2 }, args);

        const [from, toName] = args;

        if (toName.includes(sep)) {
            throw new InvalidInputError(`rn: new name contains ${sep}`);
        }

        const to = join(dirname(resolve(from)), toName);

        try {
            await rename(from, to);
        } catch (error) {
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { rn };
