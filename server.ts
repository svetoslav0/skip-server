// process.env.ENVIRONMENT = "test"; console.log("!!! USING TEST ENV !!!");

import bodyParser from "body-parser";
import "./config/env";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { UsersModel } from "./models/UsersModel";
import { ReportsModel } from "./models/ReportsModel";
import { ClassesModel } from "./models/ClassesModel";
import { ClassRolesModel } from "./models/ClassRolesModel";
import { ReportEntitiesModel } from "./models/ReportEntitiesModel";

import { UsersController } from "./controllers/users/UsersController";
import { ReportsController } from "./controllers/reports/ReportsController";
import { ClassesController } from "./controllers/classes/ClassesController";
import { ClassRolesController } from "./controllers/classRoles/ClassRolesController";
import { ReportEntitiesController } from "./controllers/reportEntities/ReportEntitiesController";

import { UsersRouter } from "./routers/UsersRouter";
import { MysqlDatabase } from "./database/MysqlDatabase";
import { ReportsRouter } from "./routers/ReportsRouter";
import { ClassesRouter } from "./routers/ClassesRouter"
import { ClassRolesRouter } from "./routers/ClassRolesRouter";
import { ReportEntitiesRouter } from "./routers/ReportEntitiesRouter";

import { APISpecification } from "./APISpecification";
import { handleError } from "./common/ErrorHandler";

const database = new MysqlDatabase();

const usersModel = new UsersModel(database);
const reportsModel = new ReportsModel(database);
const classesModel = new ClassesModel(database);
const classRolesModel = new ClassRolesModel(database);
const reportEntitiesModel = new ReportEntitiesModel(database);

const usersController = new UsersController(usersModel);
const reportsController = new ReportsController(reportsModel);
const classesController = new ClassesController(classesModel);
const classRolesController = new ClassRolesController(classRolesModel);
const reportEntitiesController = new ReportEntitiesController(reportEntitiesModel);

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
server.use(morgan("dev"));

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
