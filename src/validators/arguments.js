import { InvalidInputError } from '../errors.js';

function validateArgs({ length }, args) {
    const { min = 0, max = Infinity } =
        typeof length === 'number' ? { min: length, max: length } : length;

    if (args.length < min) {
        throw new InvalidInputError('too few arguments');
    }
    if (args.length > max) {
        throw new InvalidInputError('too many arguments');
    }
}

export { validateArgs };
