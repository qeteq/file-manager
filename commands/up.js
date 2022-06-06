import { join } from 'path';
import { InvalidInputError } from '../errors.js';

const up = {
    async exec(args) {
        if (args.length > 0) {
            throw new InvalidInputError('up: Unexpected arguments');
        }
        const currentDir = process.cwd();
        const nextDir = join(currentDir, '..');
        process.chdir(nextDir);
    },
};

export { up };
