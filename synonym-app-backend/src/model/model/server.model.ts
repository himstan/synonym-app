import { Application, RequestHandler } from "express";
import * as http from "http";
import { Controller } from "./controller.model";

/**
 * @classdesc Server class for starting the application and handling
 * the controllers and the middleware.
 */
export class Server {
  private app: Application;
  private readonly port: number;

  constructor(app: Application, port: number) {
    this.app = app;
    this.port = port;
  }

  /**
   * Starts the server.
   */
  public run(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`The server is running on port ${this.port}`);
    });
  }

  /**
   * Initializes all the middlewares.
   *
   * @param middlewares The middlewares that are going to be initialized.
   */
  public loadMiddleware(middlewares: RequestHandler[]): void {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  /**
   * Initializes all the controllers.
   *
   * @param controllers The controllers that are going to be initialized.
   */
  public loadControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.setRoutes());
    });
  }
}