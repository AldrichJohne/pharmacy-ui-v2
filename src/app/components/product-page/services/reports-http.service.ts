import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UrlService} from "../../../shared/services/url.service";

@Injectable({
  providedIn: 'root'
})
export class ReportsHttpService {

  constructor(private http : HttpClient,
              private urlService: UrlService) { }

  getReportByDateRange(startDate: string, endDate: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = { startDate, endDate };
    return this.http.get<any>(this.urlService.backendUrl + '/report/range', { headers, params });
  }
}
