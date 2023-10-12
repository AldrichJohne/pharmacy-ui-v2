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
    if (this.productSaleForm.controls[this.constantService.CONST_NEW_INVOICE].value === "true") {
      localStorage.clear();
    }
    if (this.productSaleForm.controls[this.constantService.CONST_SOLD_QTY].value > +this.saleData.remainingStock) {
      this.notifyMessage = this.messageService.ERROR_SELL_MORE_THAN_REMAINING;
      this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
      this.openNotifyDialog();
      this.productSaleForm.reset();
      this.dialogRef.close();
    } else {
      if (this.productSaleForm.controls[this.constantService.CONST_PHARMACIST].value == "" || this.productSaleForm.controls['soldQuantity'].value == "") {
        this.notifyMessage = this.messageService.ERROR_REQUIRED_FIELD;
        this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
        this.openNotifyDialog();
        this.productSaleForm.reset();
        this.dialogRef.close();
      } else {
        this.enableRequiredAdditionalFields();
        this.productSaleForm.controls[this.constantService.CONST_PRODUCT_ID].setValue(this.saleData.id);
        const convertedTransactionDate = moment(this.productSaleForm.value.transactionDateTemp).format('YYYY-MM-DD');
        this.productSaleForm.patchValue({ transactionDate: convertedTransactionDate });
        this.productSaleForm.controls[this.constantService.CONST_TXN_DATE_TEMP].disable();

        this.storeToCart(this.productSaleForm.value);
        this.notifyMessage = this.messageService.OK_PRODUCT_CART;
        this.notifyStatus = this.constantService.STATUS_NOTIFY_OK;
        this.openNotifyDialog()
        this.productSaleForm.reset();
        this.dialogRef.close(this.constantService.CONST_SALE);
      }
    }
  }

  private readyFields() {
    if (this.saleData.plainClassificationDto.name !== this.constantService.CATEGORY_GENERIC_SMALL) {
      this.productSaleForm.controls[this.constantService.CONS_DISCOUNTED].setValue(false);
      this.productSaleForm.controls[this.constantService.CONS_DISCOUNTED].disable();
    }
    if (this.saleData.remainingStock <= 0) {
      this.disableSellButton = true;
      this.productSaleForm.controls[this.constantService.CONST_SOLD_QTY].disable();
      this.productSaleForm.controls[this.constantService.CONST_TXN_DATE_TEMP].disable();
    }
    this.productSaleForm.controls[this.constantService.CONS_CLASSIFICATION].disable();
    this.productSaleForm.controls[this.constantService.CONST_PRODUCT_NAME].disable();
    this.productSaleForm.controls[this.constantService.CONST_PRICE].disable();
    this.productSaleForm.controls[this.constantService.CONST_SRP].disable();
    this.productSaleForm.controls[this.constantService.CONS_CLASSIFICATION].setValue(this.saleData.plainClassificationDto.name);
    this.productSaleForm.controls[this.constantService.CONST_PRODUCT_NAME].setValue(this.saleData.name);
    this.productSaleForm.controls[this.constantService.CONST_PRICE].setValue(this.saleData.pricePerPc);
    this.productSaleForm.controls[this.constantService.CONST_SRP].setValue(this.saleData.srpPerPc);
    this.productSaleForm.controls[this.constantService.CONST_TXN_DATE_TEMP].setValue(this.currentDate);
    this.productSaleForm.controls[this.constantService.CONST_TXN_DATE].disable();
    this.productSaleForm.controls[this.constantService.CONS_DISCOUNTED].setValue(false);
    this.productSaleForm.controls[this.constantService.CONST_PRODUCT_ID].disable();
    this.productSaleForm.controls[this.constantService.CONST_PHARMACIST].setValue(this.pharmacistOnDuty);
  }

  private enableRequiredAdditionalFields() {
    this.productSaleForm.controls[this.constantService.CONST_TXN_DATE].enable();
    this.productSaleForm.controls[this.constantService.CONS_CLASSIFICATION].enable();
    this.productSaleForm.controls[this.constantService.CONST_PRODUCT_NAME].enable();
    this.productSaleForm.controls[this.constantService.CONST_PRICE].enable();
    this.productSaleForm.controls[this.constantService.CONST_SRP].enable();
    this.productSaleForm.controls[this.constantService.CONS_DISCOUNTED].enable();
    this.productSaleForm.controls[this.constantService.CONST_PRODUCT_ID].enable();

  }

  openNotifyDialog() {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

  storeToCart(data: any) {
    const uniqueKey = `item_${new Date().getTime()}`;
    localStorage.setItem(uniqueKey, JSON.stringify(data));
    this.cashierUtilService.refreshCart();
  }

}
