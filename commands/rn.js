import { rename } from 'fs/promises';
import { dirname, join, resolve, sep } from 'path';
import { CommandFailureError, InvalidInputError } from '../errors.js';

const rn = {
    async exec(args) {
        if (args.length !== 2) {
            throw new InvalidInputError('rn: exactly 2 arguments are required');
        }

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
