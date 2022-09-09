import { Method } from "../enum/method.enum";
import { NextFunction, Request, Response } from "express";

/**
 * An interface for defining routes inside controllers.
 *
 * @param path            The path for the route.
 * @param method          The method that the route will accept request with.
 * @param handler         The handler that will process the request.
 * @param localMiddleware Middleware that will be ran only on this route.
 */
export interface Route {
  path: string;
  method: Method;
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  localMiddleware: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[];
}