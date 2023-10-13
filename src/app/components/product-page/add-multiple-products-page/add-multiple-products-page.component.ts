import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {ProductsHttpService} from "../services/products-http.service";
import * as moment from 'moment';
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationPromptComponent} from "./confirmation-prompt/confirmation-prompt.component";
import {Subscription} from "rxjs";
import {ProductsUtilService} from "../services/products-util.service";
import {MessagesService} from "../../../shared/services/messages.service";
import {ConstantsService} from "../../../shared/services/constants.service";

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
  displayedColumns: string[] = ['name', 'classId', 'totalStock', 'pricePerPc', 'srpPerPc', 'expiryDate', 'actions'];
  dataSource = new MatTableDataSource(this.productList);

  constructor(private cdRef: ChangeDetectorRef,
              private productService: ProductsHttpService,
              private messageService: MessagesService,
              private constantService: ConstantsService,
              private formBuilder : FormBuilder,
              private dialog : MatDialog,
              private router: Router,
              public productPageUtilService: ProductsUtilService) {
    this.subscription = this.productPageUtilService.confirmationPromptTrigger.subscribe(
      message => {
        switch (message) {
          case 'SAVE_BUTTON':
            this.saveProducts();
            this.productList = [];
            this.dataSource.data = this.productList;
            this.openNotifyDialog(this.messageService.SUCCESS_PRODUCT_ADD, 'OK');
            this.navigateToProducts();
            break;
          case 'CLOSE_PAGE_BUTTON':
            this.productList = [];
            this.dataSource.data = this.productList;
            this.navigateToProducts()
            break;
          case 'CLEAR_TABLE_BUTTON':
            this.productList = [];
            this.dataSource.data = this.productList;
            this.openNotifyDialog(this.messageService.SUCCESS_TABLE_CLEARED, 'OK');
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
      this.openNotifyDialog(this.messageService.ERROR_MISSING_REQUIRED_FIELDS, 'ERROR');
    } else {
      const capital = this.addProductForm.controls['pricePerPc'].value;
      const retailPrice = this.addProductForm.controls['srpPerPc'].value;
      if (capital >= retailPrice) {
        this.addProductForm.controls['srpPerPc'].setValue('');
        this.addProductForm.controls['pricePerPc'].setValue('');
        this.openNotifyDialog(this.messageService.ERROR_CAPITAL_GREATER_THAN_SRP, 'ERROR');
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

  openNotifyDialog(message: string, status: string) {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: message, notifyStatus: status }
    });
  }

  openConfirmationPrompt(message: string, triggeredBy: string) {
    this.dialog.open(ConfirmationPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: {
        message: message,
        triggeredBy: triggeredBy
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
      this.openNotifyDialog(this.messageService.ERROR_NO_PRODUCTS_IN_LIST, 'ERROR');
    } else {
      this.openConfirmationPrompt(this.messageService.CONFIRM_CLEAR_DATA, 'CLEAR_TABLE_BUTTON');
    }
  }

  btnConfirmSave() {
    if (this.productList.length === 0) {
      this.openNotifyDialog(this.messageService.ERROR_NO_PRODUCTS_IN_LIST, 'ERROR');
    } else {
      this.openConfirmationPrompt(this.messageService.CONFIRM_SAVE_PRODUCT, 'SAVE_BUTTON');
    }
  }

  btnConfirmClose() {
    if (this.productList.length === 0) {
      this.navigateToProducts();
    } else {
      this.openConfirmationPrompt(this.messageService.CONFIRM_CLOSE_PAGE,'CLOSE_PAGE_BUTTON');
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
          this.openNotifyDialog(this.messageService.SUCCESS_PRODUCT_ADD, 'OK');
        }
      })
  }

  navigateToProducts() {
    this.router.navigate(["products"]);
  }

}
