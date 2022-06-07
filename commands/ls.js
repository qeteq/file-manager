import { readdir } from 'fs/promises';
import { CommandFailureError, InvalidInputError } from '../errors.js';

const ls = {
    async exec(args, context) {
        if (args.length > 1) {
            throw new InvalidInputError('ls: too many arguments');
        }
        const [dir = '.'] = args;
        let entries;

        try {
            entries = await readdir(dir, { withFileTypes: true });
        } catch (error) {
            throw new CommandFailureError(error.message, { cause: error });
        }

        const output = entries
            .map((dirent) => {
                // TODO: customize output depending on file type
                return dirent.name;
            })
            .join('\n');

        context.writeLine(output);
    },
};

export { ls };
