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
  notifyMessage = '';
  notifyStatus = '';
  confirmationMessage = '';
  triggeredBy = '';
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
          case this.constantService.BUTTON_TRIGGER_SAVE:
            this.saveProducts();
            this.productList = [];
            this.dataSource.data = this.productList;
            this.notifyMessage = this.messageService.OK_PRODUCT_ADD;
            this.notifyStatus = this.constantService.STATUS_NOTIFY_OK;
            this.openNotifyDialog();
            this.navigateToProducts();
            break;
          case this.constantService.BUTTON_TRIGGER_CLOSE:
            this.productList = [];
            this.dataSource.data = this.productList;
            this.navigateToProducts()
            break;
          case this.constantService.BUTTON_TRIGGER_CLEAR:
            this.productList = [];
            this.dataSource.data = this.productList;
            this.notifyMessage = this.messageService.OK_TABLE_CLEARED;
            this.notifyStatus = this.constantService.STATUS_NOTIFY_OK;
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
    this.addProductForm.controls[this.constantService.TBL_HEADER_NAME_TS].setValue('');
    this.addProductForm.controls[this.constantService.TBL_HEADER_PRC_TS].setValue('');
    this.addProductForm.controls[this.constantService.TBL_HEADER_SRP_TS].setValue('');
    this.addProductForm.controls[this.constantService.TBL_HEADER_EXPR_DATE_TS].setValue('');
    this.addProductForm.controls[this.constantService.CONST_CLASS_ID].setValue('');
    this.addProductForm.controls[this.constantService.TBL_HEADER_TOTAL_STOCK_TS].setValue(0);
    this.addProductForm.controls[this.constantService.CONST_EXPR_DATE_TEMP_TS].setValue(this.currentDate);
  }

  addProductToList() {
    if (this.addProductForm.invalid) {
      this.notifyMessage = this.messageService.ERROR_REQUIRED_FIELD
      this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
      this.openNotifyDialog();
    } else {
      const capital = this.addProductForm.controls[this.constantService.TBL_HEADER_PRC_TS].value;
      const retailPrice = this.addProductForm.controls[this.constantService.TBL_HEADER_SRP_TS].value;
      if (capital >= retailPrice) {
        this.addProductForm.controls[this.constantService.TBL_HEADER_SRP_TS].setValue('');
        this.addProductForm.controls[this.constantService.TBL_HEADER_PRC_TS].setValue('');
        this.notifyMessage = this.messageService.ERROR_CAPITAL_SRP;
        this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
        this.openNotifyDialog();
      } else {
        const convertedExpiryDate = moment(this.addProductForm.value.expiryDateTemp).format('YYYY-MM-DD');
        this.addProductForm.patchValue({ expiryDate: convertedExpiryDate });
        const newProduct = {
          name: this.addProductForm.controls[this.constantService.TBL_HEADER_NAME_TS].value,
          totalStock: this.addProductForm.controls[this.constantService.TBL_HEADER_TOTAL_STOCK_TS].value,
          pricePerPc: this.addProductForm.controls[this.constantService.TBL_HEADER_PRC_TS].value,
          srpPerPc: this.addProductForm.controls[this.constantService.TBL_HEADER_SRP_TS].value,
          expiryDate: this.addProductForm.controls[this.constantService.TBL_HEADER_EXPR_DATE_TS].value,
          classId: this.addProductForm.controls[this.constantService.CONST_CLASS_ID].value,
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
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

  openConfirmationPrompt() {
    this.dialog.open(ConfirmationPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
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
      this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
      this.openNotifyDialog();
    } else {
      this.triggeredBy = this.constantService.BUTTON_TRIGGER_CLEAR;
      this.confirmationMessage = this.messageService.QUESTION_CLEAR_DATA;
      this.openConfirmationPrompt();
    }
  }

  btnConfirmSave() {
    if (this.productList.length === 0) {
      this.notifyMessage = this.messageService.ERROR_PRODUCT_ON_LIST;
      this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
      this.openNotifyDialog();
    } else {
      this.triggeredBy = this.constantService.BUTTON_TRIGGER_SAVE;
      this.confirmationMessage = this.messageService.QUESTION_PRODUCT_SAVE;
      this.openConfirmationPrompt();
    }
  }

  btnConfirmClose() {
    if (this.productList.length === 0) {
      this.navigateToProducts();
    } else {
      this.triggeredBy = this.constantService.BUTTON_TRIGGER_CLOSE;
      this.confirmationMessage = this.messageService.QUESTION_CLOSE_PAGE;
      this.openConfirmationPrompt();
    }
  }

  saveProducts () {
    let fnlProductList: any[];
    fnlProductList = this.productList;

    for (let index = 0; index < fnlProductList.length; index++) {
      switch (this.dataSource.data[index].classId) {
        case this.constantService.CATEGORY_BRANDED:
          this.dataSource.data[index].classId = 1;
          break;
        case this.constantService.CATEGORY_GENERIC:
          this.dataSource.data[index].classId = 2;
          break;
        case this.constantService.CATEGROY_GALENICALS:
          this.dataSource.data[index].classId = 3;
          break;
        case this.constantService.CATEGORY_ICE_CREAM:
          this.dataSource.data[index].classId = 4;
          break;
        case this.constantService.CATEGORY_OTHER:
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
          this.notifyStatus = this.constantService.STATUS_NOTIFY_OK;
          this.openNotifyDialog();
        }
      })
  }

  navigateToProducts() {
    this.router.navigate(["products"]);
  }

}
