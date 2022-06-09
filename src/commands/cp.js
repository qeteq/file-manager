import { constants } from 'fs';
import { copyFile } from 'fs/promises';
import { basename, join, resolve } from 'path';
import { CommandFailureError } from '../errors.js';
import { validateArgs } from '../validators/arguments.js';
import { validateStatType } from '../validators/path.js';

const cp = {
    async exec(args) {
        validateArgs({ length: 2 }, args);

        const [from, toFolder] = args;
        await validateStatType(from, 'file');

        const to = join(toFolder, basename(resolve(from)));

        try {
            await copyFile(from, to, constants.COPYFILE_EXCL);
        } catch (error) {
            throw CommandFailureError.causedBy(error);
        }
    },
};

export { cp };
