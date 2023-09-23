import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {ProductsService} from "../products.service";
import * as moment from 'moment';
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationPromptComponent} from "./confirmation-prompt/confirmation-prompt.component";

@Component({
  selector: 'app-add-multiple-products-page',
  templateUrl: './add-multiple-products-page.component.html',
  styleUrls: ['./add-multiple-products-page.component.scss']
})
export class AddMultipleProductsPageComponent implements OnInit {

  productList: any[] = [];
  addProductForm!: FormGroup;
  currentDate = new Date();
  notifyMessage = '';
  notifyStatus = '';
  confirmationMessage = '';
  triggeredBy = '';
  displayedColumns: string[] = ['name', 'classId', 'totalStock', 'pricePerPc', 'srpPerPc', 'expiryDate', 'actions'];
  dataSource = new MatTableDataSource(this.productList);

  constructor(private cdRef: ChangeDetectorRef,
              private productService: ProductsService,
              private formBuilder : FormBuilder,
              private dialog : MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.addProductForm = this.formBuilder.group({
      name: ['',Validators.required],
      classId: ['',Validators.required],
      totalStock: ['',Validators.required],
      pricePerPc: ['',Validators.required],
      srpPerPc: ['',Validators.required],
      expiryDateTemp: ['',Validators.required],
      expiryDate:['']
    });
    this.clearForm();

  }

  clearForm() {
    this.addProductForm.controls['name'].setValue('');
    this.addProductForm.controls['pricePerPc'].setValue('');
    this.addProductForm.controls['srpPerPc'].setValue('');
    this.addProductForm.controls['expiryDate'].setValue('');
    this.addProductForm.controls['classId'].setValue('');
    this.addProductForm.controls['totalStock'].setValue(0);
    this.addProductForm.controls['expiryDateTemp'].setValue(this.currentDate);
  }

  addProductToList() {
    if (this.addProductForm.invalid) {
      this.notifyMessage = 'Missing required filed.'
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      const capital = this.addProductForm.controls['pricePerPc'].value;
      const retailPrice = this.addProductForm.controls['srpPerPc'].value;
      if (capital >= retailPrice) {
        this.addProductForm.controls['srpPerPc'].setValue('');
        this.addProductForm.controls['pricePerPc'].setValue('');
        this.notifyMessage = "Capital should be smaller than SRP.";
        this.notifyStatus = "ERROR";
        this.openNotifyDialog();
      } else {
        const convertedExpiryDate = moment(this.addProductForm.value.expiryDateTemp).format('YYYY-MM-DD');
        this.addProductForm.patchValue({ expiryDate: convertedExpiryDate });
        const newProduct = {
          name: this.addProductForm.controls['name'].value,
          totalStock: this.addProductForm.controls['totalStock'].value,
          pricePerPc: this.addProductForm.controls['pricePerPc'].value,
          srpPerPc: this.addProductForm.controls['srpPerPc'].value,
          expiryDate: this.addProductForm.controls['expiryDate'].value,
          classId: this.addProductForm.controls['classId'].value,
        };

        this.productList.push(newProduct);
        this.dataSource.data = this.productList;
        this.cdRef.detectChanges();
        this.clearForm();
      }
    }
  }

  openNotifyDialog() {
    this.dialog.open(NotifyPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

  confirmClose() {
    if (this.productList.length === 0) {
      this.router.navigate(["products"]);
    } else {
      this.triggeredBy = "CLOSE-BUTTON";
      this.confirmationMessage = "Are you sure you want to close the page? the table data will disappear when closed."
      this.openConfirmationPrompt();
    }
  }

  openConfirmationPrompt() {
    this.dialog.open(ConfirmationPromptComponent, {
      width: '20%',
      data: {message: this.confirmationMessage, triggeredBy: this.triggeredBy}
    });
  }

  removeProductFromList(row : any) {
    const index = this.productList.indexOf(row);
    this.productList.splice(index, 1);
    this.dataSource.data = this.productList;
    this.cdRef.detectChanges();
    this.clearForm();
  }

  confirmClearTable() {
    if (this.productList.length === 0) {
      this.notifyMessage = 'There is no product present in the list.';
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      this.triggeredBy = "CLEAR-TABLE-BUTTON";
      this.confirmationMessage = "Are you sure you want to clear all data from the table and not save them?."
      this.openConfirmationPrompt();
    }
  }

  confirmSave() {
    if (this.productList.length === 0) {
      this.notifyMessage = 'There is no product present in the list.';
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      this.triggeredBy = "SAVE-BUTTON";
      this.confirmationMessage = "Are you sure you want to save product/s to the database?."
      this.openConfirmationPrompt();
    }
  }

}
