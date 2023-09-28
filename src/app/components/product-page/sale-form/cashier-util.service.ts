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
    this.cartItems = []; // Clear the cart items before refreshing

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      let parsedObject: any;
      if (key !== null) {
        const storedValue = sessionStorage.getItem(key);

        if (storedValue != null) {
          parsedObject = JSON.parse(storedValue);
          console.log(parsedObject);
        }

        this.cartItems.push(parsedObject);
        console.log(this.cartItems)
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

  private getCartLength() {
    this.cartLength = this.cartItems.length - 1;
  }
}
