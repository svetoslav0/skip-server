// process.env.ENVIRONMENT = "test"; console.log("!!! USING TEST ENV !!!");

import bodyParser from "body-parser";
import "./config/env";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { MysqlDatabase } from "./database/MysqlDatabase";

import { UsersRepository } from "./repositories/UsersRepository";
import { ReportsRepository } from "./repositories/ReportsRepository";
import { ClassesRepository } from "./repositories/ClassesRepository";
import { ClassRolesRepository } from "./repositories/ClassRolesRepository";
import { ReportEntitiesRepository } from "./repositories/ReportEntitiesRepository";

import { UsersController } from "./controllers/users/UsersController";
import { ReportsController } from "./controllers/reports/ReportsController";
import { ClassesController } from "./controllers/classes/ClassesController";
import { ClassRolesController } from "./controllers/classRoles/ClassRolesController";
import { ReportEntitiesController } from "./controllers/reportEntities/ReportEntitiesController";

import { UsersRouter } from "./routers/UsersRouter";
import { ReportsRouter } from "./routers/ReportsRouter";
import { ClassesRouter } from "./routers/ClassesRouter";
import { ClassRolesRouter } from "./routers/ClassRolesRouter";
import { ReportEntitiesRouter } from "./routers/ReportEntitiesRouter";

import { APISpecification } from "./APISpecification";
import { handleError } from "./common/ErrorHandler";
import { UsersResponseFormatter } from "./controllers/users/UsersResponseFormatter";

const database = new MysqlDatabase();

const usersRepository = new UsersRepository(database);
const reportsRepository = new ReportsRepository(database);
const classesRepository = new ClassesRepository(database);
const classRolesRepository = new ClassRolesRepository(database);
const reportEntitiesRepository = new ReportEntitiesRepository(database);

const usersFormatter = new UsersResponseFormatter();

const usersController = new UsersController(usersRepository, usersFormatter);
const reportsController = new ReportsController(reportsRepository);
const classesController = new ClassesController(classesRepository);
const classRolesController = new ClassRolesController(classRolesRepository);
const reportEntitiesController = new ReportEntitiesController(reportEntitiesRepository);

const usersRouter = new UsersRouter(usersController);
const reportsRouter = new ReportsRouter(reportsController);
const classesRouter = new ClassesRouter(classesController);
const classRolesRouter = new ClassRolesRouter(classRolesController);
const reportEntitiesRouter = new ReportEntitiesRouter(reportEntitiesController);

const server = express();
const port: number = +(process.env.SERVER_PORT || 8080);

server.use(cors());
server.use(bodyParser.urlencoded({
    extended: true
}));

if (process.env.ENVIRONMENT !== "test") {
    server.use(morgan("dev"));
}

server.use("/users", usersRouter.registerRoutes());
server.use("/reports", reportsRouter.registerRoutes());
server.use("/classes", classesRouter.registerRoutes());
server.use("/classRoles", classRolesRouter.registerRoutes());
server.use("/reportEntities", reportEntitiesRouter.registerRoutes());

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
