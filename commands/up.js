import { join } from 'path';
import { CommandFailureError, InvalidInputError } from '../errors.js';

const up = {
    async exec(args) {
        if (args.length > 0) {
            throw new InvalidInputError('up: Unexpected arguments');
        }
        const currentDir = process.cwd();
        const nextDir = join(currentDir, '..');
        try {
            process.chdir(nextDir);
        } catch (error) {
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { up };
