import { userInfo } from 'os';
import { validateNodeVersion } from './src/validators/node.js';
import { FileManager } from './src/file-manager.js';

validateNodeVersion();

const fm = new FileManager({ username: userInfo().username });
fm.start({ cwd: '.' });
