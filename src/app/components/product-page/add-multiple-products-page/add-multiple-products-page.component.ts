import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {ProductsService} from "../products.service";
import * as moment from 'moment';
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationPromptComponent} from "./confirmation-prompt/confirmation-prompt.component";
import {Subscription} from "rxjs";
import {ProductPageUtilService} from "../product-page-util.service";
import {MessagesService} from "../../../shared/services/messages.service";

@Component({
  selector: 'app-add-multiple-products-page',
  templateUrl: './add-multiple-products-page.component.html',
  styleUrls: ['./add-multiple-products-page.component.scss']
})
export class AddMultipleProductsPageComponent implements OnInit {

  productList: any[] = [];
  subscription: Subscription;
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
              private messageService: MessagesService,
              private formBuilder : FormBuilder,
              private dialog : MatDialog,
              private router: Router,
              public productPageUtilService: ProductPageUtilService) {
    this.subscription = this.productPageUtilService.confirmationPromptTrigger.subscribe(
      message => {
        switch (message) {
          case 'SAVE_BUTTON':
            this.saveProducts();
            this.productList = [];
            this.dataSource.data = this.productList;
            this.notifyMessage = this.messageService.OK_PRODUCT_ADD;
            this.notifyStatus = 'OK';
            this.openNotifyDialog();
            this.router.navigate(["products"]);
            break;
          case 'CLOSE_PAGE_BUTTON':
            this.productList = [];
            this.dataSource.data = this.productList;
            this.router.navigate(["products"]);
            break;
          case 'CLEAR_TABLE_BUTTON':
            this.productList = [];
            this.dataSource.data = this.productList;
            this.notifyMessage = this.messageService.OK_TABLE_CLEARED;
            this.notifyStatus = 'OK';
            this.openNotifyDialog();
            break;
          default:
            break;
        }
      }
    )
  }

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
      this.notifyMessage = this.messageService.ERROR_REQUIRED_FIELD
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      const capital = this.addProductForm.controls['pricePerPc'].value;
      const retailPrice = this.addProductForm.controls['srpPerPc'].value;
      if (capital >= retailPrice) {
        this.addProductForm.controls['srpPerPc'].setValue('');
        this.addProductForm.controls['pricePerPc'].setValue('');
        this.notifyMessage = this.messageService.ERROR_CAPITAL_SRP;
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

  openConfirmationPrompt() {
    this.dialog.open(ConfirmationPromptComponent, {
      width: '20%',
      data: {
        message: this.confirmationMessage,
        triggeredBy: this.triggeredBy
      }
    })
  }

  btnRemoveProductFromList(row : any) {
    const index = this.productList.indexOf(row);
    this.productList.splice(index, 1);
    this.dataSource.data = this.productList;
    this.cdRef.detectChanges();
    this.clearForm();
  }

  btnConfirmClearTable() {
    if (this.productList.length === 0) {
      this.notifyMessage = this.messageService.ERROR_PRODUCT_ON_LIST;
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      this.triggeredBy = "CLEAR_TABLE_BUTTON";
      this.confirmationMessage = this.messageService.QUESTION_CLEAR_DATA;
      this.openConfirmationPrompt();
    }
  }

  btnConfirmSave() {
    if (this.productList.length === 0) {
      this.notifyMessage = this.messageService.ERROR_PRODUCT_ON_LIST;
      this.notifyStatus = 'ERROR';
      this.openNotifyDialog();
    } else {
      this.triggeredBy = "SAVE_BUTTON";
      this.confirmationMessage = this.messageService.QUESTION_PRODUCT_SAVE;
      this.openConfirmationPrompt();
    }
  }

  btnConfirmClose() {
    if (this.productList.length === 0) {
      this.router.navigate(["products"]);
    } else {
      this.triggeredBy = "CLOSE_PAGE_BUTTON";
      this.confirmationMessage = this.messageService.QUESTION_CLOSE_PAGE;
      this.openConfirmationPrompt();
    }
  }

  saveProducts () {
    let fnlProductList: any[];
    fnlProductList = this.productList;

    for (let index = 0; index < fnlProductList.length; index++) {
      switch (this.dataSource.data[index].classId) {
        case 'Branded':
          this.dataSource.data[index].classId = 1;
          break;
        case 'Generic':
          this.dataSource.data[index].classId = 2;
          break;
        case 'Galenical':
          this.dataSource.data[index].classId = 3;
          break;
        case 'Ice Cream':
          this.dataSource.data[index].classId = 4;
          break;
        case 'Others':
          this.dataSource.data[index].classId = 5;
          break;
      }
    }

    this.productService.addBatchProduct(this.productList)
      .subscribe({
        next: ()=> {
          this.productList = [];
          this.dataSource.data = this.productList;
          this.notifyMessage = this.messageService.OK_PRODUCT_ADD;
          this.notifyStatus = 'OK';
          this.openNotifyDialog();
        }
      })
  }

}
