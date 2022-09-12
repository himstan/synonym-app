import express, { Application } from "express";
import { Server } from '../../src/model/model/server.model'
import { globalMiddlewares } from "../../src/config/middleware.config";
import { controllers } from "../../src/config/controllers.config";
import * as Http from "http";

export class IntegrationHelpers {
    public static appInstance: Application;
    public static server: Http.Server;

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
            this.server = server.run();
        }
        return this.appInstance;
    }

    public static async closeApp(): Promise<void> {
        if (this.appInstance && this.server) {
            this.appInstance = null;
            this.server.close();
            this.server = null;
        }
    }
}