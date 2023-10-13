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

    this.productForm.controls['totalStock'].setValue(0);
    this.productForm.controls['expiryDateTemp'].setValue(this.currentDate);
  }

  addProduct() {
    const capital = this.productForm.controls['pricePerPc'].value;
    const retailPrice = this.productForm.controls['srpPerPc'].value;
    if (capital != '' && retailPrice != '' && capital >= retailPrice) {
      this.productForm.controls['srpPerPc'].setValue('');
      this.productForm.controls['pricePerPc'].setValue('');
      this.openNotifyDialog(this.messageService.ERROR_CAPITAL_GREATER_THAN_SRP, 'ERROR');
    } else {
      this.productForm.controls['expiryDate'].enable();
      const convertedExpiryDate = moment(this.productForm.value.expiryDateTemp).format('YYYY-MM-DD');
      this.productForm.patchValue({ expiryDate: convertedExpiryDate });
      this.productService.setCategory(JSON.stringify(this.productForm.get('category')!.value));
      if(this.productForm.valid) {
        this.productService.addProduct(this.productForm.value)
          .subscribe({
            next:()=>{
              this.openNotifyDialog(this.messageService.SUCCESS_PRODUCT_ADD, 'OK');
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            error:()=>{
              this.openNotifyDialog(this.messageService.ERROR_FAILED_TO_ADD_PRODUCT, 'ERROR');
            }
          })
      }
      else {
        this.openNotifyDialog(this.messageService.ERROR_MISSING_REQUIRED_FIELDS, 'ERROR');
      }
    }
  }

  openNotifyDialog(message: string, status: string) {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: message, notifyStatus: status }
    });
  }

}
