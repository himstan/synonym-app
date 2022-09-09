import express, { Application } from "express";
import { Server } from '../../src/model/model/server.model'
import { globalMiddlewares } from "../../src/config/middleware.config";
import { controllers } from "../../src/config/controllers.config";

export class IntegrationHelpers {
    public static appInstance: Application;

    public static async getApp(startServer = false): Promise<Application> {
        if (this.appInstance) {
            return this.appInstance;
        }
        const port = 9090;
        this.appInstance = express();
        if (startServer) {
            const server = new Server(this.appInstance, port);
            server.loadMiddleware(globalMiddlewares);
            server.loadControllers(controllers);
            server.run();
        }
        return this.appInstance;
    }
}