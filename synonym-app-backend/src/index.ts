import express from "express";
import { Server } from "./model/model/server.model";
import { controllers } from "./config/controllers.config";
import { corsConfig, globalMiddlewares } from "./config/middleware.config";
import { config } from "dotenv";

config();
const app = express();
const port = Number(process.env.PORT);

const server = new Server(app, port);

server.loadMiddleware(globalMiddlewares);
console.log(corsConfig.origin);
server.loadControllers(controllers);
server.run();
