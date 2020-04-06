// process.env.ENVIRONMENT = "test"; console.log("!!! USING TEST ENV !!!");

import bodyParser from "body-parser";
import "./config/env";
import express from "express";
import cors from "cors";
import { UsersRouter } from "./routers/UsersRouter";
import { MysqlDatabase } from "./database/MysqlDatabase";
import { ReportsRouter } from "./routers/ReportsRouter";
import { ClassesRouter } from "./routers/ClassesRouter"

import { APISpecification } from "./APISpecification";
import { handleError } from "./common/ErrorHandler";

const database = new MysqlDatabase();

const usersRouter = new UsersRouter(database);
const reportsRouter = new ReportsRouter(database);
const classesRouter = new ClassesRouter(database);

const server = express();
const port: number = +(process.env.SERVER_PORT || 8080);

server.use(cors());
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use("/users", usersRouter.registerRoutes());
server.use("/reports", reportsRouter.registerRoutes());
server.use("/classes", classesRouter.registerRoutes());

server.get("/specification", (req, res) => {
    res.send(
        new APISpecification().buildSpecification()
    );
});

server.use((
        err: express.ErrorRequestHandler,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction) => {

    handleError(err, res);
});

server.listen(port, () => console.log(`Listening on port ${port}`));

export { server, database };
