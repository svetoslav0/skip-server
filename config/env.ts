import { config } from "dotenv";
import { resolve } from "path";

const conf = config({ path: resolve(__dirname, "../../.env") });

if (conf.error && process.env.ENVIRONMENT !== "test") {
    throw conf.error;
}

export { conf };
