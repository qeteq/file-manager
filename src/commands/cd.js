import { homedir } from 'os';
import { resolve } from 'path';
import { CommandFailureError } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';

const cd = {
    async exec(args) {
        validateArgs({ length: { min: 0, max: 1 } }, args);

        const [dir = homedir()] = args;
        const nextDir = resolve(process.cwd(), dir);
        try {
            process.chdir(nextDir);
        } catch (error) {
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { cd };
