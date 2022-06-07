import * as os from 'os';
import { InvalidInputError } from '../errors.js';

const eol = os.EOL.replace('\n', '\\n').replace('\r', '\\r');

const subcommands = {
    EOL: () => eol,
    cpus: () => {
        const list = os.cpus().map(({ model, speed }) => {
            // prettier-ignore
            return [
                `  - model: ${model}`,
                `    speed: ${(speed/1000).toFixed(3)} GHz`
            ].join('\n');
        });

        // prettier-ignore
        return [
            `total: ${list.length}`,
            'cores:',
            ...list,
        ].join('\n');
    },
    homedir: () => os.homedir(),
    username: () => os.userInfo().username,
    architecture: () => os.arch(),
};

const allowedOptions = Object.keys(subcommands).map((k) => '--' + k);

const osCommand = {
    async exec(args, context) {
        if (args.length !== 1) {
            throw new InvalidInputError('os: exactly 1 argument is required');
        }
        const [option] = args;
        if (!allowedOptions.includes(option)) {
            throw new InvalidInputError(`os: unknown option ${option}`);
        }

        const subcommandName = option.slice(2);
        context.writeLine(subcommands[subcommandName]());
    },
};

export { osCommand as os };
