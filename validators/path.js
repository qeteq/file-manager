import { constants } from 'fs';
import { access, stat } from 'fs/promises';
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

/** @typedef {'file' | 'directory' | 'blockDevice' | 'characterDevice' | 'fifo' | 'socket'} FileType */

/**
 * @param {string} path
 * @param {Array<FileType> | FileType} types
 */
export async function validateStatType(path, types) {
    if (!Array.isArray(types)) {
        types = [types];
    }

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
        const msg = types.length > 1 ? `one of ${types.join(', ')}` : types[0];
        throw new CommandFailureError(`${path} is not ${msg}`);
    }
}

async function exists(path) {
    try {
        await access(path, constants.R_OK);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        if (error.code === 'EACCES' || error.code === 'EPERM') {
            return true;
        }
        throw error;
    }
}

export async function validateDoesNotExist(path) {
    let ex;
    try {
        ex = await exists(path);
    } catch (error) {
        throw CommandFailureError.causedBy(error);
    }

    if (ex) {
        throw new CommandFailureError(`${path} exists`);
    }
}
