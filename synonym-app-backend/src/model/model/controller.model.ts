import { NextFunction, Request, Response, Router } from "express";
import { Route } from "./route.model";
import { validationResult } from "express-validator";

/**
 * Controller class for handling REST calls.
 */
export abstract class Controller {
  public router: Router = Router();
  public abstract path: string;
  protected abstract readonly routes: Route[];

  /**
   * Sets all the routes for the class's router.
   */
  public setRoutes = (): Router => {
    for (const route of this.routes) {
      for (const middleWare of route.localMiddleware) {
        this.router[route.method](route.path, middleWare.bind(this));
      }
      this.router[route.method](route.path, route.handler.bind(this));
    }

    return this.router;
  };

  /**
   * Sends a 200 OK response with an optional payload.
   *
   * @param res   The response object.
   * @param data  The payload that is sent back.
   */
  protected sendSuccess(
    res: Response,
    data?: object
  ): Response {
    return res.status(200).json({
      data
    });
  }

  /**
   * Sends a 500 Internal Error response with an optional payload.
   *
   * @param res   The response object.
   * @param body  The payload that is sent back.
   */
  protected sendError(res: Response, body?: object): Response {
    return res.status(500).json(body);
  }

  /**
   * Used as a validation middleware. If it finds any validation error during the request,
   * then it will stop the process and send back an error object with the information about
   * the validation errors.
   *
   * @param req   The request object.
   * @param res   The response object.
   * @param next  The next function.
   */
  protected validate(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      this.sendError(res, { errors: errors.array() })
    } else {
      next();
    }
  }
}