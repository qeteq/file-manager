import { createInterface } from 'readline';
import { EventEmitter } from 'events';
import { promisify } from 'util';

import { InvalidInputError } from './errors.js';

const getValue = (x) => (typeof x === 'function' ? x() : x);

const inputWordRe = /^(?:([^'"\s]+)|'([^']*)'|"([^"]*)")/;

/**
 * @param {string} input
 * @returns {{ name: string, args: string[] }}
 */
function parseCommand(input) {
    let name = '';
    const args = [];

    input = input.trim();

    while (input.length) {
        const match = input.match(inputWordRe);
        if (!match) {
            throw new InvalidInputError('Invalid input');
        }
        const [substring, ...rest] = match;
        const word = rest.find((x) => x !== undefined);

        if (!name) {
            if (!word) {
                throw new InvalidInputError('Command is required');
            }
            name = word;
        } else {
            args.push(word);
        }

        input = input.slice(substring.length).trim();
    }

    return { name, args };
}

export class Repl extends EventEmitter {
    /**
     * @param {NodeJS.ReadableStream} [input]
     * @param {NodeJS.WritableStream} [output]
     * @param {object} [options]
     * @param { prompt: string | () => string} [options.prompt]
     */
    constructor(
        input = process.stdin,
        output = process.stdout,
        { prompt = '🍤 > ' } = {}
    ) {
        super();
        this._input = input;
        this._output = output;
        this._prompt = prompt;

        this._closed = false;
        this._commands = new Map();

        this._rli = createInterface(input, output);
        this._question = promisify(this._rli.question).bind(this._rli);
        this._rli.on('close', () => this._handleClose());
    }

    /**
     *
     * @param {string} name
     * @param {{ exec: (args: string[], context: any) => any }} command
     */
    registerCommand(name, command) {
        console.log(name, command);
        if (!name) {
            throw new Error('Command name is required');
        }
        if (!command) {
            throw new Error('Command is required');
        }
        if (typeof command.exec !== 'function') {
            throw new Error(`Command "${name}" does not have exec method`);
        }
        if (this._commands.has(name)) {
            throw new Error(`Duplicate command: "${name}"`);
        }
        this._commands.set(name, command);
    }

    /**
     * @param {object} [options]
     * @param {AbortSignal} [options.signal]
     * @returns
     */
    async prompt() {
        if (this._closed) {
            throw new Error('prompt after close');
        }
        const promptString = getValue(this._prompt);
        const input = await this._question(promptString);
        return parseCommand(input);
    }

    /**
     * @param {string | Buffer} content
     */
    writeLine(content) {
        this._output.write(content);
        this._output.write('\n');
    }

    start() {
        // Repl event loop
        (async () => {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                try {
                    const ac = new AbortController();
                    const { signal } = ac;
                    const { name, args } = await this.prompt();
                    const command = this._findCommand(name);
                    await command.exec(args, {
                        ...this._getCommandContext(),
                        signal,
                    });
                } catch (e) {
                    if (e.name === 'InvalidInputError') {
                        this.writeLine('Invalid input');
                    } else {
                        throw e;
                    }
                }
            }
        })();
    }

    /** @private */
    _handleClose() {
        this._closed = true;
        this.emit('exit');
    }

    /** @private */
    _findCommand(name) {
        const command = this._commands.get(name);
        if (!command) {
            throw new InvalidInputError(`Unknown command: ${command}`);
        }
        return command;
    }

    /** @private */
    _getCommandContext() {
        if (!this._cachedCommandContext) {
            this._cachedCommandContext = {};
        }
        return this._cachedCommandContext;
    }
}
