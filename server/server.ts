import express from 'express';
import bodyParser from 'body-parser';

import {usersRouter} from "./routers/usersRouter";

const app = express();
const port: number = 3300;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/users', usersRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));

