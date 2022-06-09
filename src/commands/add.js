import { writeFile } from 'fs/promises';
import { CommandFailureError } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';

const add = {
    async exec(args, { signal }) {
        validateArgs({ length: 1 }, args);

        const [name] = args;
        try {
            await writeFile(name, '', { flag: 'wx', signal });
        } catch (error) {
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { add };
