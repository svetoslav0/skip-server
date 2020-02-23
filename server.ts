import bodyParser from "body-parser";
import "./config/env";
import express from "express";
import cors from "cors";
import { usersRouter } from "./routers/usersRouter";
import { reportsRouter } from "./routers/reportsRouter";

const server = express();
const port: number = +(process.env.SERVER_PORT || 8080);

server.use(cors());
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use("/users", usersRouter);
server.use("/reports", reportsRouter);

server.listen(port, () => console.log(`Listening on port ${port}`));

export default server;
