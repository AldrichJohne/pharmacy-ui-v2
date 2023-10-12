import { Injectable } from '@angular/core';
import {UrlService} from "../../../shared/services/url.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductsHttpService {

  classification = '';

  public setCategory(category: string) {
    this.classification = category;
  }

  constructor(private http : HttpClient,
              public urlService: UrlService) { }

  getProducts() {
    return this.http.get<any>(this.urlService.backendUrl + '/inventory/products')
  }

  addProduct(data : any) {
    return this.http.post(this.urlService.backendUrl + '/inventory/' + this.classification + '/products', data)
  }

  addBatchProduct(data :any) {
    return this.http.post(this.urlService.backendUrl + '/v2/products/batch', data)
  }

  deleteProduct(id : number) {
    return this.http.delete<any>(this.urlService.backendUrl + '/inventory/products/' + id)
  }

  updateProduct(data : any, id : number) {
    return this.http.put<any>(this.urlService.backendUrl + '/inventory/products/' + id, data)
  }
}
