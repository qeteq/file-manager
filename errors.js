class BaseError extends Error {
    get name() {
        return this.constructor.name;
    }
    constructor(msg, details = {}) {
        super(msg);
        // this.name = this.constructor.name;
        Object.assign(this, details);
    }
}

export class InvalidInputError extends BaseError {}
export class CommandFailureError extends BaseError {}
export class CommandAbortError extends BaseError {}

/**
 * @param {Error} error
 * @returns {boolean}
 */
export function isAbortError(error) {
    return (
        (error.code === 'ABORT_ERR' && error.name === 'AbortError') ||
        error instanceof CommandAbortError
    );
}

export function rethrowIf(error, type) {
    if (error instanceof type) {
        throw error;
    }
}

export function rethrowIfAbort(error) {
    if (isAbortError(error)) {
        throw error;
    }
}
