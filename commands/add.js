import { writeFile } from 'fs/promises';
import { CommandFailureError, InvalidInputError } from '../errors.js';

const add = {
    async exec(args, { signal }) {
        if (args.length < 1) {
            throw new InvalidInputError('add: missing argument');
        }

        const [name] = args;
        try {
            await writeFile(name, '', { flag: 'wx', signal });
        } catch (error) {
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { add };
