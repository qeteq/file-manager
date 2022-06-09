import { stat } from 'fs/promises';
import { CommandFailureError } from '../errors.js';

/** @type {Record<string, (stats: import('fs').Stats) => boolean} */
const statPredicates = {
    file: (i) => i.isFile(),
    directory: (i) => i.isDirectory(),
    blockDevice: (i) => i.isBlockDevice(),
    characterDevice: (i) => i.isCharacterDevice(),
    fifo: (i) => i.isFIFO(),
    socket: (i) => i.isSocket(),
};

/**
 * @param {string} path
 * @param {Array<'file' | 'directory' | 'blockDevice' | 'characterDevice' | 'fifo' | 'socket'>} types
 */
export async function validateStatType(path, types) {
    let itemStat;
    try {
        itemStat = await stat(path);
    } catch (error) {
        if (error.code === 'EACCES' || error.code === 'ENOENT') {
            throw CommandFailureError.causedBy(error);
        }
        throw error;
    }

    const passesTest = types
        .filter((t) => statPredicates[t])
        .some((t) => statPredicates[t](itemStat));

    if (!passesTest) {
        throw new CommandFailureError(`${path} is not one of ${types.join(', ')}`);
    }
}
