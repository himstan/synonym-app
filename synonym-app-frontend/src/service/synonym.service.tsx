import { Observable } from "rxjs";
import { SynonymGetResponseDto } from "../model/dto/synonym-get-response.dto";
import { request } from "../core/util/http.util";
import { Method } from "../core/enum/method.enum";

const path = '/api/synonym/';

export function fetchSynonyms(word: string): Observable<SynonymGetResponseDto> {
  return request(path + word, Method.GET);
}

export function saveSynonym(word: string, synonym: string): Observable<Response> {
  const requestDto = {word, synonym};
  return request(path, Method.POST, requestDto);
}