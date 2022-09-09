import { Application, RequestHandler } from "express";
import * as http from "http";
import { Controller } from "./controller.model";

export class Server {
  private app: Application;
  private readonly port: number;

  constructor(app: Application, port: number) {
    this.app = app;
    this.port = port;
  }

  public run(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`The server is running on port ${this.port}`);
    });
  }

  public loadMiddleware(middlewares: RequestHandler[]): void {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  public loadControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.setRoutes());
    });
  }
}