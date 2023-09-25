import {Component, Inject, OnInit} from '@angular/core';
import * as moment from 'moment';
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductsService} from "../products.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MessagesService} from "../../../shared/services/messages.service";

@Component({
  selector: 'app-update-product-form',
  templateUrl: './update-product-form.component.html',
  styleUrls: ['./update-product-form.component.scss']
})
export class UpdateProductFormComponent implements OnInit {

  productForm!: FormGroup;
  name = '';
  class = '';
  currentStock = '';
  totalStock = '';
  sold = '';
  capital = '';
  retailPrice = '';
  gross = '';
  profit = '';
  expiration = '';

  notifyMessage = '';
  notifyStatus = '';

  constructor(@Inject(MAT_DIALOG_DATA) public editData: any,
              private dialogRef: MatDialogRef<UpdateProductFormComponent>,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              private productService: ProductsService,
              private messageService: MessagesService) {
  }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['',Validators.required],
      category: ['',Validators.required],
      totalStock: ['',Validators.required],
      expiryDateTemp: ['',Validators.required],
      expiryDate:['']
    });

    this.name = this.editData.name;
    this.class = this.editData.plainClassificationDto.name;
    this.currentStock = this.editData.remainingStock;
    this.totalStock = this.editData.totalStock;
    this.sold = this.editData.sold;
    this.capital = this.editData.pricePerPc;
    this.retailPrice = this.editData.srpPerPc;
    this.gross = this.editData.gross;
    this.profit = this.editData.profit;
    this.expiration = this.editData.expiryDate;

    this.productForm.controls['name'].setValue(this.name);
    this.productForm.controls['totalStock'].setValue(this.totalStock);
    this.productForm.controls['expiryDateTemp'].setValue(this.expiration);
  }

  closeForm() {
    this.dialogRef.close();
  }

  updateProduct() {
    if (this.productForm.controls['totalStock'].value < this.sold) {
      this.notifyMessage = this.messageService.ERROR_TOTAL_STOCK_SOLD;
      this.notifyStatus = "ERROR";
      this.openNotifyPrompt();
      this.productForm.controls['totalStock'].setValue(this.totalStock);
    } else {
      const convertedExpiryDate = moment(this.productForm.value.expiryDateTemp).format('YYYY-MM-DD');
      const updatedProductValue = {
        name: this.productForm.controls['name'].value,
        totalStock: this.productForm.controls['totalStock'].value,
        expiryDate: convertedExpiryDate
      };

      this.productService.updateProduct(updatedProductValue, this.editData.id)
        .subscribe({
          next:()=>{
            this.notifyMessage = this.messageService.OK_PRODUCT_UPDATE;
            this.notifyStatus = 'OK';
            this.openNotifyPrompt();
            this.productForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            this.notifyMessage = this.messageService.ERROR_PRODUCT_UPDATE;
            this.notifyStatus = 'ERROR';
            this.openNotifyPrompt();
          }
        })
    }
  }

  openNotifyPrompt() {
    this.dialog.open(NotifyPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

}
