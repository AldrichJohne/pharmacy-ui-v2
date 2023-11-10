import {Component} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CashierUtilService} from "../services/cashier-util.service";
import {CashierHttpService} from "../services/cashier-http.service";
import {DatePipe} from "@angular/common";
import {ApplicationBackendUtilService} from "../../../shared/services/application-backend-util.service";
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import {ConstantsService} from "../../../shared/services/constants.service";
import {jsPDF} from 'jspdf';
import {Router} from "@angular/router";
import {MessagesService} from "../../../shared/services/messages.service";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  providers: [DatePipe]
})
export class CartPageComponent {

  cartForm!: FormGroup;
  displayedColumns: string[] = [
    'productId',
    'name',
    'class',
    'price',
    'srp',
    'quantity',
    'isDiscounted',
    'pharmacist',
    'transactionDate',
    'actions'];
  dataSource = new MatTableDataSource(this.cashierUtilService.cartItems);
  totalPrice = 0;
  payment = 0;
  change = 0;
  businessName = '';
  businessAlias = '';
  businessAddress = '';
  businessTIN = '';
  txnInvoice = '';

  vatRate = 12;
  vatSale: string = '';
  receiptProducts: any[] = [];
  productSavedVerified: Object = [];
  receiptButtonStatus = true;
  calcButtonStatus = false;

  productsOnCart: any;

  constructor(private formBuilder : FormBuilder,
              private dialog : MatDialog,
              private cashierUtilService: CashierUtilService,
              private cashierHttpService: CashierHttpService,
              private constantService: ConstantsService,
              private messageService: MessagesService,
              public datePipe: DatePipe,
              private applicationBackendUtilService: ApplicationBackendUtilService,
              private router: Router) { }

  ngOnInit(): void {
    this.cartForm = this.formBuilder.group({
      payment:['',Validators.required]
    })

    this.productsOnCart = this.cashierUtilService.cartItems;
    this.totalPrice = this.cashierUtilService.cartTotalPrice;
    this.getBusinessInfo();
  }

  openNotifyDialog(message: string, status: string) {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: message, notifyStatus: status }
    });
  }

  removeProductFromList(row : any) {
    localStorage.removeItem(row.key);
    this.refreshCart();
  }

  confirmClose(){
    this.router.navigate(["products"]);
  }

  clearField() {
    this.cartForm.reset();
    this.payment = 0;
    this.change = 0;
  }

  confirmPayment() {
    if (this.cartForm.controls['payment'].value < this.totalPrice) {
      this.openNotifyDialog(this.messageService.ERROR_INSUFFICIENT_PAYMENT, 'ERROR');
      this.cartForm.reset();
    } else {
      this.payment = this.cartForm.controls['payment'].value;
      this.change = this.payment - this.totalPrice;

      this.cashierHttpService.batchProductSale(this.productsOnCart)
        .subscribe({
          next:(res)=> {
            // @ts-ignore
            this.txnInvoice = res.responseObject[0].invoiceCode;
            this.generateReceipt();
            // @ts-ignore
            this.productSavedVerified = res.responseObject;
            this.openNotifyDialog(this.messageService.SUCCESS_PRODUCT_SOLD, 'OK');
            // @ts-ignore
            this.productsOnCart = res.responseObject;
            this.cartForm.reset();
            this.receiptButtonStatus = false;
            this.calcButtonStatus = true;
            localStorage.clear();
            this.refreshCart();
          }, error: ()=> {
            this.openNotifyDialog(this.messageService.ERROR_FAILED_TO_SAVE_SALE, 'ERROR');
          }
        })
    }
  }

  refreshCart() {
    this.cashierUtilService.refreshCart();
    this.totalPrice = this.cashierUtilService.cartTotalPrice;
    this.dataSource = new MatTableDataSource(this.cashierUtilService.cartItems);
  }

  getBusinessInfo() {
    this.applicationBackendUtilService.healthCheck().subscribe({
      next:(res) => {
        this.businessName = res.responseObject.businessInfo.businessName;
        this.businessAlias = res.responseObject.businessInfo.businessAlias;
        this.businessAddress = res.responseObject.businessInfo.businessAddress;
        this.businessTIN = res.responseObject.businessInfo.businessTin;
      }
    })
  }

  generateReceipt() {
    this.generateProductOnReceipt();
    const currentDateTime = this.datePipe.transform(new Date(), 'MM/dd/yyyy h:mm:ss');
    const doc = new jsPDF();
    const textSpacing = 10;
    const startX = 10;
    let startY = 10;

    doc.text(this.businessName, startX, startY);
    startY += textSpacing;
    doc.text(this.businessAddress, startX, startY);
    startY += textSpacing;
    doc.text(this.businessTIN, startX, startY);
    startY += textSpacing;
    // @ts-ignore
    doc.text(currentDateTime, startX, startY);
    startY += textSpacing;
    doc.text('Txn #:' + this.txnInvoice, startX, startY);
    startY += textSpacing;
    doc.text('________________________', startX, startY);

    //Product Table
    const headers = ["product", "qty", "price"];
    const tableTopMargin = startY + textSpacing;

    let tableX = startX;
    const tableY = tableTopMargin;
    const cellWidth = 30;
    const cellHeight = textSpacing;

    headers.forEach((header) => {
      doc.text(header, tableX, tableY);
      tableX += cellWidth;
    });

    const products = this.receiptProducts;

    let dataX = startX;
    let dataY = tableY + cellHeight;

    products.forEach((product) => {
      const productNameLines = doc.splitTextToSize(product.productName, cellWidth);
      for (let i = 0; i < productNameLines.length; i++) {
        doc.text(productNameLines[i], dataX, dataY + i * cellHeight);
      }
      doc.text(product.qty.toString(), dataX + cellWidth, dataY);
      doc.text(product.price.toFixed(2), dataX + 2 * cellWidth, dataY);
      dataY += cellHeight * Math.max(productNameLines.length, 1);
    });

    doc.text('________________________', startX, dataY);
    dataY += textSpacing;
    doc.text('VAT Amount('+this.vatRate+'%): ' + this.generateVATAmount(), startX, dataY);
    dataY += textSpacing;
    doc.text('(V)Vatable Sales: ' + this.vatSale, startX, dataY);
    dataY += textSpacing;
    dataY += textSpacing;
    doc.text('SUBTOTAL: ' + this.totalPrice, startX, dataY);
    dataY += textSpacing;
    doc.text('AMOUNT TENDERED: ' + this.payment, startX, dataY);
    dataY += textSpacing;
    doc.text('CHANGE: ' + this.change, startX, dataY);
    dataY += textSpacing;

    try {
      doc.save(this.businessAlias + this.generateFormattedCurrentDateTime());
    } catch (error) {
      this.openNotifyDialog(this.messageService.ERROR_FAILED_TO_SAVE_PDF, 'ERROR');
    }
  }

  generateVATAmount() {
    const totalAmount = this.totalPrice;
    const vatPercentage = this.vatRate;
    console.log(totalAmount)
    console.log(vatPercentage)
    const vatAmount = (totalAmount * vatPercentage) / (100 + vatPercentage);
    let unformattedVatSale = this.totalPrice - vatAmount;
    this.vatSale = unformattedVatSale.toFixed(2);
    console.log(vatAmount.toFixed(2));
    return vatAmount.toFixed(2)
  }

  generateFormattedCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    return year + month + day + hours + minutes;
  }

  generateProductOnReceipt() {
    // @ts-ignore
    for (const element of this.productSavedVerified) {
      let price = element.soldQuantity * element.srp;
      const newProductOnReceipt = {
        productName: element.productName,
        qty: element.soldQuantity,
        price: price
      };
      this.receiptProducts.push(newProductOnReceipt);
    }
  }

}
