import { userInfo, homedir } from 'os';
import { Repl } from './repl.js';
import { up } from './commands/up.js';
import { cd } from './commands/cd.js';

const commands = {
    up,
    cd,
};

class FileManager {
    constructor({ username }) {
        this._username = username;

        this._repl = new Repl(process.stdin, process.stdout, {
            prompt: () => `\nYou are currently in ${process.cwd()}\n🍤 > `,
            context: {
                getUsername: () => this._username,
            },
        });

        Object.entries(commands).forEach(([name, command]) => {
            this._repl.registerCommand(name, command);
        });
    }

    start() {
        process.chdir(homedir());

        this._repl.writeLine(`Hello, ${this._username}!`);
        this._repl.on('exit', () => {
            this._repl.writeLine('\n\nGoodbye!');
        });

        this._repl.start();
    }
}

const fm = new FileManager({ username: userInfo().username });
fm.start();
