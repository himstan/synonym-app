import { json, urlencoded } from "express";
import cors from 'cors';

export const corsConfig = {
  origin: process.env.FRONTEND_URL,
}

export const globalMiddlewares = [
  cors(corsConfig),
  urlencoded({ extended: false }),
  json()
]