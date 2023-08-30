import { Injectable } from '@angular/core';
import {UrlService} from "../../shared/services/url.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http : HttpClient,
              public urlService: UrlService) { }

  getProducts() {
    return this.http.get<any>(this.urlService.backendUrl + '/inventory/products')
  }
}
