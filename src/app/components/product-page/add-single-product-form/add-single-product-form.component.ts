import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductsHttpService} from "../services/products-http.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import * as moment from 'moment';
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import {MessagesService} from "../../../shared/services/messages.service";
import {ConstantsService} from "../../../shared/services/constants.service";

@Component({
  selector: 'app-add-single-product-form',
  templateUrl: './add-single-product-form.component.html',
  styleUrls: ['./add-single-product-form.component.css']
})
export class AddSingleProductFormComponent implements OnInit {

  productForm!: FormGroup;
  currentDate = new Date();
  notifyMessage = '';
  notifyStatus = '';

  constructor(private formBuilder : FormBuilder,
              private productService: ProductsHttpService,
              private messageService: MessagesService,
              private constantService: ConstantsService,
              private dialogRef : MatDialogRef<AddSingleProductFormComponent>,
              private dialog : MatDialog,
              @Inject(MAT_DIALOG_DATA) public editData : any) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['',Validators.required],
      category: ['',Validators.required],
      totalStock: ['',Validators.required],
      pricePerPc: ['',Validators.required],
      srpPerPc: ['',Validators.required],
      expiryDateTemp: ['',Validators.required],
      expiryDate:['']
    });

    this.productForm.controls[this.constantService.TBL_HEADER_TOTAL_STOCK_TS].setValue(0);
    this.productForm.controls[this.constantService.CONST_EXPR_DATE_TEMP_TS].setValue(this.currentDate);
  }

  addProduct() {
    const capital = this.productForm.controls[this.constantService.TBL_HEADER_PRC_TS].value;
    const retailPrice = this.productForm.controls[this.constantService.TBL_HEADER_SRP_TS].value;
    if (capital != '' && retailPrice != '' && capital >= retailPrice) {
      this.productForm.controls[this.constantService.TBL_HEADER_SRP_TS].setValue('');
      this.productForm.controls[this.constantService.TBL_HEADER_PRC_TS].setValue('');
      this.notifyMessage = this.messageService.ERROR_CAPITAL_SRP;
      this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
      this.openNotifyDialog();
    } else {
      this.productForm.controls[this.constantService.TBL_HEADER_EXPR_DATE_TS].enable();
      const convertedExpiryDate = moment(this.productForm.value.expiryDateTemp).format('YYYY-MM-DD');
      this.productForm.patchValue({ expiryDate: convertedExpiryDate });
      this.productService.setCategory(JSON.stringify(this.productForm.get(this.constantService.CONST_CATEGORY)!.value));
      if(this.productForm.valid) {
        this.productService.addProduct(this.productForm.value)
          .subscribe({
            next:()=>{
              this.notifyMessage = this.messageService.OK_PRODUCT_ADD;
              this.notifyStatus = this.constantService.STATUS_NOTIFY_OK;
              this.openNotifyDialog();
              this.productForm.reset();
              this.dialogRef.close(this.constantService.CONST_SAVE);
            },
            error:()=>{
              this.notifyMessage = this.messageService.ERROR_PRODUCT_ADD;
              this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
              this.openNotifyDialog();
            }
          })
      }
      else {
        this.notifyMessage = this.messageService.ERROR_REQUIRED_FIELD;
        this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
        this.openNotifyDialog();
      }
    }
  }

  openNotifyDialog() {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

}
