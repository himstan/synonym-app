import { Method } from "../enum/method.enum";
import { NextFunction, Request, Response } from "express";

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