import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UrlService} from "../../../shared/services/url.service";

@Injectable({
  providedIn: 'root'
})
export class CashierHttpService {

  constructor(private http : HttpClient,
              private urlService: UrlService) { }

  batchProductSale(data : any) {
    return this.http.post(this.urlService.backendUrl + '/cashier/v2/product/batch/sell', data)
  }

  getProductSales() {
    return this.http.get<any>(this.urlService.backendUrl + '/cashier/products/sell');
  }

  deleteProductSoldRecord(id : number) {
    return this.http.delete<any>(this.urlService.backendUrl + '/cashier/product/sell/' + id)
  }

}
