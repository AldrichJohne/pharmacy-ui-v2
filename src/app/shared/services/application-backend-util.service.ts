import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UrlService} from "./url.service";

@Injectable({
  providedIn: 'root'
})
export class ApplicationBackendUtilService {

  constructor(private http : HttpClient,
              private urlService: UrlService) { }

  healthCheck() {
    return this.http.get<any>(this.urlService.backendUrl + '/health/check');
  }
}
