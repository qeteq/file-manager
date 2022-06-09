import { validateArgs } from '../validators/arguments.js';
import { cd } from './cd.js';

const up = {
    async exec(args) {
        validateArgs({ length: 0 }, args);
        return cd.exec(['..']);
    },
};

export { up };
