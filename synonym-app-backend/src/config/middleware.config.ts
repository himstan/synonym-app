import { json, urlencoded } from "express";
import cors from 'cors';
import { config } from "dotenv";

config();

export const corsConfig = {
  origin: process.env.FRONTEND_URL,
}

export const globalMiddlewares = [
  cors(corsConfig),
  urlencoded({ extended: false }),
  json()
]