import { readdir } from 'fs/promises';
import { CommandFailureError } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';

const ls = {
    async exec(args, context) {
        validateArgs({ length: { max: 1 } }, args);

        const [dir = '.'] = args;
        let entries;

        try {
            entries = await readdir(dir, { withFileTypes: true });
        } catch (error) {
            throw CommandFailureError.causedBy(error);
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
