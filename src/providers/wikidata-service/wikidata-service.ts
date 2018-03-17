import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class WikidataServiceProvider {

  private _url = 'https://www.wikidata.org/w/api.php?action=wbgetentities&languages=es&format=json&origin=*&ids=';

  constructor(public http: HttpClient) { }

  getWikidataInfo(qid: any) {
    return this.http.get(this._url + qid)
      .toPromise()
      .then(respuesta => {
        if (respuesta && respuesta['entities'] && respuesta['entities'][qid]) {
          return respuesta['entities'][qid];
        } else {
          return false;
        }
      });
  }

}
