import { homedir, userInfo } from 'os';
import { validateNodeVersion } from './src/validators/node.js';
import { FileManager } from './src/file-manager.js';
import { realpath } from 'fs/promises';

validateNodeVersion();

const options = process.argv.slice(2).reduce(
    (opts, arg) => {
        const [k, v] = arg.replace(/^--/, '').split('=');
        if (v) {
            opts[k] = v;
        } else {
            opts._.push(k);
        }
        return opts;
    },
    { _: [] }
);

const { username = userInfo().username } = options;

let cwd = homedir();
if (options._[0]) {
    try {
        cwd = await realpath(options._[0]);
    } catch (error) {
        // ignore
    }
}

const fm = new FileManager({ username });
await fm.start({ cwd });
