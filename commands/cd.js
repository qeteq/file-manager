import { homedir } from 'os';
import { resolve } from 'path';
import { CommandFailureError, InvalidInputError } from '../errors.js';

const cd = {
    async exec(args) {
        if (args.length > 1) {
            throw new InvalidInputError('cd: too many arguments');
        }
        const [dir = homedir()] = args;
        const nextDir = resolve(process.cwd(), dir);
        try {
            process.chdir(nextDir);
        } catch (error) {
            throw new CommandFailureError(
                'cd: cannot change current working directory',
                { cause: error }
            );
        }
    },
};

export { cd };
