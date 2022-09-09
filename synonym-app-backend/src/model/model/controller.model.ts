import { NextFunction, Request, Response, Router } from "express";
import { Route } from "./route.model";
import { validationResult } from "express-validator";

export abstract class Controller {
  public router: Router = Router();
  public abstract path: string;
  protected abstract readonly routes: Route[];

  public setRoutes = (): Router => {
    for (const route of this.routes) {
      try {
        for (const middleWare of route.localMiddleware) {
          this.router[route.method](route.path, middleWare.bind(this));
        }

        this.router[route.method](route.path, route.handler.bind(this));
      } catch (err) {
        console.error(`There was a problem while setting up route: ${route}`);
        console.error(err);
      }
    }

    return this.router;
  };

  protected sendSuccess(
    res: Response,
    data: object = {}
  ): Response {
    return res.status(200).json({
      data
    });
  }

  protected sendError(res: Response, body?: any): Response {
    return res.status(500).json(body);
  }

  protected validate(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
      this.sendError(res, { errors: errors.array() })
    } else {
      next();
    }
  }
}