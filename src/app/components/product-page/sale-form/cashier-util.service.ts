import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CashierUtilService {

  cartItems: any[] = [];
  cartTotalSrp = 0;
  discountRate = .8;
  cartLength = 0;

  refreshCart() {
    this.cartItems = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      let parsedObject: any;
      if (key !== null) {
        const storedValue = localStorage.getItem(key);

        if (storedValue != null) {
          parsedObject = JSON.parse(storedValue);
        }

        this.cartItems.push(parsedObject);
      }
    }
    this.computeTotalSrp();
    this.getCartLength();
  }


  private computeTotalSrp() {
    let totalSrp = 0;
    for (const element of this.cartItems) {
      if (element.isDiscounted === false) {
        totalSrp = totalSrp + (element.srp * element.soldQuantity);
      }
      else {
        totalSrp = totalSrp + ((element.srp * element.soldQuantity) * this.discountRate)
      }
    }
    this.cartTotalSrp = totalSrp;
  }

  public getCartLength() {
    this.cartLength = this.cartItems.length;
  }
}
