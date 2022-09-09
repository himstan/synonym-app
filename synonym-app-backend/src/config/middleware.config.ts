import { json, urlencoded } from "express";

export const globalMiddlewares = [
  urlencoded({ extended: false }),
  json()
]