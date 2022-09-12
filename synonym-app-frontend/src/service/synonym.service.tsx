import { from, map, mergeMap, Observable, throwError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { SynonymGetResponseDto } from "../model/dto/synonym-get-response.dto";

const SERVER_URL = process.env.REACT_APP_BACKEND_URL;
const url = SERVER_URL + '/api/synonym/';

export function fetchSynonyms(word: string): Observable<SynonymGetResponseDto> {
  return fromFetch(url + word, { method: 'get', mode: 'cors'})
    .pipe(
      mergeMap(result => from(result.json())
        .pipe(map(result => result.data))
      ));
}

export function saveSynonym(word: string, synonym: string): Observable<Response> {
  const requestDto = JSON.stringify({word, synonym});
  return fromFetch(
    url,
    { headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
      method: 'post',
      mode: 'cors',
      body: requestDto })
    .pipe(map(value => {
    if (!value.ok) {
      throw throwError(() => value);
    } else {
      return value;
    }
  }));
}