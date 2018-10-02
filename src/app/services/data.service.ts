import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService {

  constructor(private http: Http) {
  }

  public getData(url) {
    return this.http.get(url);
  }


}
