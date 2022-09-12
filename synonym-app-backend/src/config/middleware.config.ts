import { json, urlencoded } from "express";
import cors from 'cors';

export const corsConfig = {
  origin: 'http://localhost:3000',
}

export const globalMiddlewares = [
  cors(corsConfig),
  urlencoded({ extended: false }),
  json()
]