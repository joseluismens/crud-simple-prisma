import { Router, Request, Response } from "express";

import book from "./book";

const routes = Router();

routes.use("/api",book);


export default routes;