import { NextFunction, Request, Response } from "express";
import { Controller } from "../model/model/controller.model";
import { Method } from "../model/enum/method.enum";
import { SynonymAddRequestDto } from "../model/dto/synonym-add-request.dto";
import { SynonymGetResponseDto } from "../model/dto/synonym-get-response.dto";
import { Route } from "../model/model/route.model";
import { SynonymService } from "../service/synonym.service";
import { body, param } from "express-validator";

/**
 * Controller class for handling all the synonym route calls.
 */
export class SynonymController extends Controller{

  path = '/api/synonym'
  routes: Route[] = [
    {
      path: '/:word',
      method: Method.GET,
      handler: this.getSynonyms,
      localMiddleware: [
        param('word', 'Field is missing')
          .exists({checkFalsy: true, checkNull: true}),
        param('word' , 'The field\'s length is lower than 1 or higher than 12')
          .isLength({min: 1, max: 20}),
        this.validate
      ]
    },
    {
      path: '/',
      method: Method.POST,
      handler: this.addSynonym,
      localMiddleware: [
        body(['word', 'synonym'], 'Field is missing')
          .exists({checkFalsy: true, checkNull: true}),
        body(['word', 'synonym'], 'The field\'s length is lower than 1 or higher than 12')
          .isLength({min: 1, max: 20}),
        this.validate
      ]
    }
  ]

  private synonymService: SynonymService;

  constructor() {
    super();
    this.synonymService = new SynonymService();
  }

  /**
   * Handler for getting the synonyms through an endpoint.
   */
  getSynonyms(req: Request, res: Response, next: NextFunction): void {
    const word = req.params.word;
    const synonyms = this.synonymService.getSynonymsFor(word);
    this.sendSuccess(res, SynonymController.buildResponseDto(word, synonyms))
  }

  /**
   * Handler for adding a new synonym for a word.
   */
  addSynonym(req: Request, res: Response, next: NextFunction): void {
    const requestDto = req.body as SynonymAddRequestDto;
    const { word, synonym } = requestDto;
    this.synonymService.addSynonymFor(word, synonym);
    this.sendSuccess(res, requestDto);
  }

  private static buildResponseDto(word: string, synonyms: Set<string>): SynonymGetResponseDto {
    return {
      word,
      synonyms: Array.from(synonyms)
    }
  }

}