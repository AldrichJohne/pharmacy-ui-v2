import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductsService} from "../products.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import * as moment from 'moment';
import {NotifyPromptComponent} from "../../prompts/notify-prompt/notify-prompt.component";

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
              private productService: ProductsService,
              private dialogRef : MatDialogRef<AddSingleProductFormComponent>,
              private dialog : MatDialog) { }

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
      this.notifyMessage = "Capital should be smaller than SRP.";
      this.notifyStatus = "ERROR";
      this.openNotifyDialog();
    } else {
      this.productForm.controls['expiryDate'].enable();
      const convertedExpiryDate = moment(this.productForm.value.expiryDateTemp).format('YYYY-MM-DD');
      this.productForm.patchValue({ expiryDate: convertedExpiryDate });
      this.productService.setCategory(JSON.stringify(this.productForm.get('category')!.value));
      if(this.productForm.valid) {
        this.productService.addProduct(this.productForm.value)
          .subscribe({
            next:()=>{
              this.notifyMessage = 'Product Added Successfully';
              this.notifyStatus = 'OK';
              this.openNotifyDialog();
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            error:()=>{
              this.notifyMessage = 'Error Adding Product';
              this.notifyStatus = 'ERROR';
              this.openNotifyDialog();
            }
          })
      }
      else {
        this.notifyMessage = 'Missing required fields.';
        this.notifyStatus = 'ERROR';
        this.openNotifyDialog();
      }
    }
  }

  openNotifyDialog() {
    this.dialog.open(NotifyPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

}
