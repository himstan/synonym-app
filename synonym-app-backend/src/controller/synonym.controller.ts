import { NextFunction, Request, Response } from "express";
import { Controller } from "../model/model/controller.model";
import { Method } from "../model/enum/method.enum";
import { SynonymAddRequestDto } from "../model/dto/synonym-add-request.dto";
import { SynonymGetResponseDto } from "../model/dto/synonym-get-response.dto";
import { Route } from "../model/model/route.model";
import { SynonymService } from "../service/synonym.service";
import { body } from "express-validator";

export class SynonymController extends Controller{

  path = '/api/synonym'
  routes: Route[] = [
    {
      path: '/:word',
      method: Method.GET,
      handler: this.getSynonyms,
      localMiddleware: []
    },
    {
      path: '/',
      method: Method.POST,
      handler: this.addSynonym,
      localMiddleware: [
        body(['word', 'synonym'], 'Field is missing')
          .exists({checkFalsy: true, checkNull: true}),
        body(['word', 'synonym'], 'The field\'s length is lower than 1 or higher than 12')
          .isLength({min: 1, max: 12}),
        this.validate
      ]
    }
  ]

  private synonymService: SynonymService;

  constructor() {
    super();
    this.synonymService = new SynonymService();
  }

  getSynonyms(req: Request, res: Response, next: NextFunction): void {
    const word = req.params?.word;
    try {
      const synonyms = this.synonymService.getSynonymsFor(word);
      this.sendSuccess(res, SynonymController.buildResponseDto(word, synonyms))
    } catch (error) {
      console.error(error);
      this.sendError(res, { error: `There was a problem while fetching synonyms for ${word}` });
    }
  }

  addSynonym(req: Request, res: Response, next: NextFunction): void {
    const requestDto = req.body as SynonymAddRequestDto;
    const { word, synonym } = requestDto;
    try {
      this.synonymService.addSynonymFor(word, synonym);
      this.sendSuccess(res);
    } catch (error) {
      console.error(error);
      this.sendError(res, { error: `There was a problem while adding synonym: ${synonym} for word: ${word}` });
    }
  }

  private static buildResponseDto(word: string, synonyms: Set<string>): SynonymGetResponseDto {
    return {
      word,
      synonyms: Array.from(synonyms)
    }
  }

}