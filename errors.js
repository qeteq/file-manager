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
