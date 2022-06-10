import { createInterface } from 'readline';
import { PassThrough } from 'stream';

export function validateNodeVersion() {
    const i = new PassThrough();
    const o = new PassThrough();
    const rli = createInterface(i, o);
    try {
        const ac = new AbortController();
        rli.question('', { signal: ac.signal }, () => {});
        i.write('\n');
        rli.close();
        return;
    } catch (e) {
        if (e instanceof RangeError) {
            const version = process.version;
            console.error(`Node ${version} is not supported`);
            process.exit(1);
        }
        throw e;
    }
}
