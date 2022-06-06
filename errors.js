export class InvalidInputError extends Error {
    get name() {
        return this.constructor.name;
    }
}

export class CommandFailureError extends Error {
    get name() {
        return this.constructor.name;
    }
}
