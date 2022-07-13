import { Router, Request, Response } from "express";

import book from "./book";
import user from "./user.routes";
import auth from "./auth.routes";

const routes = Router();

routes.use("/api",book);
routes.use("/api",user);
routes.use("/api",auth);


export default routes;