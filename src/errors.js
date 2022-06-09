class BaseError extends Error {
    get name() {
        return this.constructor.name;
    }

    /**
     * @param {string} msg
     * @param {object} [details]
     */
    constructor(msg, details = {}) {
        super(msg);
        Object.assign(this, details);
    }
}

export class CommandAbortError extends BaseError {}
export class InvalidInputError extends BaseError {}
export class CommandFailureError extends BaseError {
    /**
     * @param {Error} cause
     * @returns {CommandFailureError}
     */
    static causedBy(cause) {
        if (cause instanceof CommandFailureError) {
            return cause;
        }
        return new CommandFailureError(cause.message, { cause });
    }
}

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

/**
 * @param {Error} error
 * @param {new () => Error} type
 * @returns {boolean}
 */
export function rethrowIf(error, type) {
    if (error instanceof type) {
        throw error;
    }
}

/**
 * @param {Error} error
 * @returns {boolean}
 */
export function rethrowIfAbort(error) {
    if (isAbortError(error)) {
        throw error;
    }
}
