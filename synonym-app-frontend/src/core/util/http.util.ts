import { from, map, mergeMap, Observable, throwError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { Method } from "../enum/method.enum";

const SERVER_URL = process.env.REACT_APP_BACKEND_URL;

export function request(path: string, method: Method, body?: object): Observable<any> {
  return fromFetch(SERVER_URL + path,
    {
      method: method,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: !!body ? JSON.stringify(body) : null
    })
    .pipe(
      mergeMap(result => {
        if (!result.ok) {
          throw throwError(() => result);
        } else {
          return from(result.json())
            .pipe(map(value => value.data));
        }
      }));
}