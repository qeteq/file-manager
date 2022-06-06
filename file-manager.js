import { userInfo } from 'os';
import { Repl } from './repl.js';
import { up } from './commands/up.js';

const commands = {
    up,
};

class FileManager {
    constructor() {
        this._repl = new Repl(process.stdin, process.stdout, {
            prompt: () => `\nYou are currently in ${process.cwd()}\n🍤 > `,
        });

        Object.entries(commands).forEach(([name, command]) => {
            this._repl.registerCommand(name, command);
        });
    }

    start({ username = userInfo().username } = {}) {
        this._repl.writeLine(`Hello, ${username}!`);
        this._repl.start();
        this._repl.on('exit', () => {
            this._repl.writeLine('\n\nGoodbye!');
        });
    }
}

const fm = new FileManager();
fm.start();
