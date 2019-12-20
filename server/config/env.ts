import { config } from "dotenv";
import { resolve } from "path";

const conf = config({ path: resolve(__dirname, "../../../server/.env") });

if (conf.error) {
    throw conf.error;
}
