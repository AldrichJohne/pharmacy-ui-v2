import {Component, Inject, OnInit} from '@angular/core';
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CashierHttpService} from "../services/cashier-http.service";
import {CashierUtilService} from "../services/cashier-util.service";
import {ConstantsService} from "../../../shared/services/constants.service";
import {MessagesService} from "../../../shared/services/messages.service";

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss']
})
export class SaleFormComponent implements OnInit {

  productSaleForm!: FormGroup;
  productSaleFormTitle: string = "ADD TO CART"
  currentDate = new Date();
  disableSellButton = false;
  notifyStatus = '';
  notifyMessage = '';
  pharmacistOnDuty = 'AJ';
  productToCart: any[] = [];

  constructor(private formBuilder : FormBuilder,
              private cashierService: CashierHttpService,
              private cashierUtilService: CashierUtilService,
              private constantService: ConstantsService,
              private messageService: MessagesService,
              @Inject(MAT_DIALOG_DATA) public saleData : any,
              private dialogRef : MatDialogRef<SaleFormComponent>,
              private dialog : MatDialog) { }

  ngOnInit(): void {
    this.productSaleForm = this.formBuilder.group({
      classification:['',Validators.required],
      productName:['',Validators.required],
      price:['',Validators.required],
      srp:['',Validators.required],
      soldQuantity:['',Validators.required],
      transactionDateTemp:['',Validators.required],
      transactionDate:[''],
      isDiscounted:['',Validators.required],
      productId:['', Validators.required],
      pharmacist:['', Validators.required],
      newInvoice: ['false', Validators.required]
    })
    this.readyFields();
  }

  addToCart() {
    if (this.productSaleForm.controls['newInvoice'].value === "true") {
      localStorage.clear();
    }
    if (this.productSaleForm.controls['soldQuantity'].value > +this.saleData.remainingStock) {
      this.openNotifyDialog(this.messageService.ERROR_INSUFFICIENT_STOCK, 'ERROR');
      this.productSaleForm.reset();
      this.dialogRef.close();
    } else {
      if (this.productSaleForm.controls['pharmacist'].value == "" || this.productSaleForm.controls['soldQuantity'].value == "") {
        this.openNotifyDialog(this.messageService.ERROR_MISSING_REQUIRED_FIELDS, 'ERROR');
        this.productSaleForm.reset();
        this.dialogRef.close();
      } else {
        this.enableRequiredAdditionalFields();
        this.productSaleForm.controls['productId'].setValue(this.saleData.id);
        const convertedTransactionDate = moment(this.productSaleForm.value.transactionDateTemp).format('YYYY-MM-DD');
        this.productSaleForm.patchValue({ transactionDate: convertedTransactionDate });
        this.productSaleForm.controls['transactionDateTemp'].disable();

        this.storeToCart(this.productSaleForm.value);
        this.openNotifyDialog(this.messageService.SUCCESS_PRODUCT_ADDED_TO_CART, 'OK')
        this.productSaleForm.reset();
        this.dialogRef.close('sale');
      }
    }
  }

  private readyFields() {
    if (this.saleData.plainClassificationDto.name !== 'generics') {
      this.productSaleForm.controls['isDiscounted'].setValue(false);
      this.productSaleForm.controls['isDiscounted'].disable();
    }
    if (this.saleData.remainingStock <= 0) {
      this.disableSellButton = true;
      this.productSaleForm.controls['soldQuantity'].disable();
      this.productSaleForm.controls['transactionDateTemp'].disable();
    }
    this.productSaleForm.controls['classification'].disable();
    this.productSaleForm.controls['productName'].disable();
    this.productSaleForm.controls['price'].disable();
    this.productSaleForm.controls['srp'].disable();
    this.productSaleForm.controls['classification'].setValue(this.saleData.plainClassificationDto.name);
    this.productSaleForm.controls['productName'].setValue(this.saleData.name);
    this.productSaleForm.controls['price'].setValue(this.saleData.pricePerPc);
    this.productSaleForm.controls['srp'].setValue(this.saleData.srpPerPc);
    this.productSaleForm.controls['transactionDateTemp'].setValue(this.currentDate);
    this.productSaleForm.controls['transactionDate'].disable();
    this.productSaleForm.controls['isDiscounted'].setValue(false);
    this.productSaleForm.controls['productId'].disable();
    this.productSaleForm.controls['pharmacist'].setValue(this.pharmacistOnDuty);
  }

  private enableRequiredAdditionalFields() {
    this.productSaleForm.controls['transactionDate'].enable();
    this.productSaleForm.controls['classification'].enable();
    this.productSaleForm.controls['productName'].enable();
    this.productSaleForm.controls['price'].enable();
    this.productSaleForm.controls['srp'].enable();
    this.productSaleForm.controls['isDiscounted'].enable();
    this.productSaleForm.controls['productId'].enable();

  }

  openNotifyDialog(message: string, status: string) {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: message, notifyStatus: status }
    });
  }

  storeToCart(data: any) {
    const uniqueKey = `item_${new Date().getTime()}`;
    localStorage.setItem(uniqueKey, JSON.stringify(data));
    this.cashierUtilService.refreshCart();
  }

}
