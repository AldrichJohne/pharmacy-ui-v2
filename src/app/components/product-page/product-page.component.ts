import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ProductsHttpService} from "./services/products-http.service";
import {MatDialog} from "@angular/material/dialog";
import {AddSingleProductFormComponent} from "./add-single-product-form/add-single-product-form.component";
import {DeletePromptProductsComponent} from "./delete-prompt-products/delete-prompt-products.component";
import {UpdateProductFormComponent} from "./update-product-form/update-product-form.component";
import {Router} from "@angular/router";
import {MessagesService} from "../../shared/services/messages.service";
import {ConstantsService} from "../../shared/services/constants.service";
import {SaleFormComponent} from "./sale-form/sale-form.component";
import {CashierUtilService} from "./services/cashier-util.service";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  productStatus = '';
  currentCartValue = 0;

  productColumns: string[] = [
    'cashier',
    'name',
    'className',
    'remainingStock',
    'totalStock',
    'sold',
    'pricePerPc',
    'srpPerPc',
    'totalGross',
    'profit',
    'expiryDate',
    'action'];

  productsDataSource!: MatTableDataSource<any>;
  @ViewChild('productsPaginator') productsPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductsHttpService,
              private messageService: MessagesService,
              private constantService: ConstantsService,
              private cashierUtilService: CashierUtilService,
              private dialog : MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.getProducts();
    this.cashierUtilService.refreshCart();
    this.currentCartValue = this.cashierUtilService.cartLength;
  }

  getProducts() {
    this.productService.getProducts()
      .subscribe({
        next:(res)=>{
          this.productsDataSource = new MatTableDataSource(res);
          this.productsDataSource.paginator = this.productsPaginator;
          this.productsDataSource.sort = this.sort;
          this.checkProductStatus(res);
        },
        error:()=>{
          this.productStatus = this.messageService.ERROR_FAILED_TO_FETCH_PRODUCTS;
        }
      })
  }

  deletePrompt(row : any) {
    this.dialog.open(DeletePromptProductsComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: row
    }).afterClosed().subscribe(_val => {
      this.getProducts();
    })
  }

  updateForm(row : any) {
    this.dialog.open(UpdateProductFormComponent, {
      width: this.constantService.DIALOG_FORM_WIDTH,
      data: row
    }).afterClosed().subscribe(val=>{
      this.getProducts();
    })
  }

  addSingleProduct() {
    this.dialog.open(AddSingleProductFormComponent, {
      width: this.constantService.DIALOG_FORM_WIDTH,
    }).afterClosed().subscribe(_val=>{
        this.getProducts();
    })
  }

  addMultipleProducts() {
    this.router.navigate(["products/add-multiple"]);
  }

  openCart() {
    this.router.navigate(["products/cart"]);
  }

  openProductSoldPage() {
    this.router.navigate(["products/sold"]);
  }

  openReportsPage() {
    this.router.navigate(["products/reports"]);
  }

  applyFilterProducts(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.productsDataSource.paginator) {
      this.productsDataSource.paginator.firstPage();
    }
  }

  openSaleFrom(row : any) {
    this.dialog.open(SaleFormComponent,{
      width: this.constantService.DIALOG_FORM_WIDTH,
      data:row
    }).afterClosed().subscribe( _val => {
      this.cashierUtilService.refreshCart();
      this.currentCartValue = this.cashierUtilService.cartLength;
    })
  }

  checkProductStatus(response: any) {
    for (const row of response) {
      const givenExpiryDate = new Date(row.expiryDate);
      const currentDate = new Date();
      const timeDiff = givenExpiryDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (daysDiff <= 0) {
        row.disableCashier = true;
        row.expiryStatus = 'expired';
      }
      if (row.remainingStock <= 0) {
        row.disableCashier = true;
        row.remainingStock = 0;
      }
    }
  }

}
