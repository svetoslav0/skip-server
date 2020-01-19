import bodyParser from "body-parser";
import "./config/env";
import express from "express";
import { usersRouter } from "./routers/usersRouter";

const app = express();
const port: number = +(process.env.SERVER_PORT || 8080);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/users", usersRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));
