import { Controller } from "../model/model/controller.model";
import { SynonymController } from "../controller/synonym.controller";

export const controllers: Controller[] = [
  new SynonymController()
]