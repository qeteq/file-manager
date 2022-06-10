import { homedir } from 'os';
import { Repl } from './repl.js';

import * as commands from './commands/index.js';

class FileManager {
    constructor({ username }) {
        this._username = username;

        const input = process.stdin;
        const output = process.stdout;

        this._repl = new Repl(input, output, {
            prompt: () => `\nYou are currently in ${process.cwd()}\n🍤 > `,
            context: {
                writeLine: (str) => this._repl.writeLine(str),
                output,
            },
        });

        Object.entries(commands).forEach(([name, command]) => {
            this._repl.registerCommand(name, command);
        });
    }

    async start({ cwd = homedir() } = {}) {
        process.chdir(cwd);

        this._repl.writeLine(`Hello, ${this._username}!`);
        await this._repl.startLoop();
        this._repl.writeLine('\n\nGoodbye!');
    }
}

export { FileManager };
