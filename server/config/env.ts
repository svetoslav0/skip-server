import { resolve } from 'path';
import { config } from 'dotenv';

let conf = config({ path: resolve(__dirname, '../../../server/.env') });

if (conf.error) {
    throw conf.error;
}
