import { userInfo, homedir } from 'os';
import { Repl } from './repl.js';

import { up } from './commands/up.js';
import { cd } from './commands/cd.js';
import { ls } from './commands/ls.js';
import { sleep } from './commands/sleep.js';
import { cat } from './commands/cat.js';
import { add } from './commands/add.js';
import { rn } from './commands/rn.js';
import { cp } from './commands/cp.js';
import { mv } from './commands/mv.js';
import { rm } from './commands/rm.js';
import { os } from './commands/os.js';

const commands = {
    up,
    cd,
    ls,
    sleep,
    cat,
    add,
    rn,
    cp,
    mv,
    rm,
    os,
};

class FileManager {
    constructor({ username }) {
        this._username = username;

        const input = process.stdin;
        const output = process.stdout;

        this._repl = new Repl(input, output, {
            prompt: () => `\nYou are currently in ${process.cwd()}\n🍤 > `,
            context: {
                getUsername: () => this._username,
                writeLine: (str) => this._repl.writeLine(str),
                output,
            },
        });

        Object.entries(commands).forEach(([name, command]) => {
            this._repl.registerCommand(name, command);
        });
    }

    start({ cwd = homedir() } = {}) {
        process.chdir(cwd);

        this._repl.writeLine(`Hello, ${this._username}!`);
        this._repl.on('exit', () => {
            this._repl.writeLine('\n\nGoodbye!');
        });

        this._repl.start();
    }
}

const fm = new FileManager({ username: userInfo().username });
fm.start({ cwd: '.' });
