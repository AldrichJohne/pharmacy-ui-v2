import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UrlService} from "../../../shared/services/url.service";

@Injectable({
  providedIn: 'root'
})
export class CashierHttpService {

  constructor(private http : HttpClient,
              public urlService: UrlService) { }

  productSale(data : any, id : number, discountSwitch: any) {
    const params = { discountSwitch };
    return this.http.post(this.urlService.backendUrl + '/cashier/product/sell/' + id, data, {params})
  }

}
