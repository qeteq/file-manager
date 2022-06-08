import { constants } from 'fs';
import { copyFile } from 'fs/promises';
import { basename, join, resolve } from 'path';
import { CommandFailureError, InvalidInputError } from '../errors.js';

const cp = {
    async exec(args) {
        if (args.length !== 2) {
            throw new InvalidInputError('cp: exactly 2 arguments are required');
        }

        // TODO: validate from is file
        const [from, toFolder] = args;
        const to = join(toFolder, basename(resolve(from)));

        try {
            await copyFile(from, to, constants.COPYFILE_EXCL);
        } catch (error) {
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { cp };
