import express from "express";
import { Server } from "./model/model/server.model";
import { controllers } from "./config/controllers.config";
import { globalMiddlewares } from "./config/middleware.config";

const app = express();
const port = 8080;

const server = new Server(app, port);

server.loadMiddleware(globalMiddlewares);
server.loadControllers(controllers);
server.run();
