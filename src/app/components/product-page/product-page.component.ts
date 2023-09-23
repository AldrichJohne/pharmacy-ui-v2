import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ProductsService} from "./products.service";
import {MatDialog} from "@angular/material/dialog";
import {AddSingleProductFormComponent} from "./add-single-product-form/add-single-product-form.component";
import {DeletePromptProductsComponent} from "./delete-prompt-products/delete-prompt-products.component";
import {UpdateProductFormComponent} from "./update-product-form/update-product-form.component";
import {Router} from "@angular/router";
import {MessagesService} from "../../shared/services/messages.service";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  productStatus = '';
  currentCartValue = 1;

  productColumns: string[] = ['cashier', 'name', 'className', 'remainingStock', 'totalStock', 'sold', 'pricePerPc', 'srpPerPc', 'totalGross', 'profit', 'expiryDate', 'action'];
  productsDataSource!: MatTableDataSource<any>;
  @ViewChild('productsPaginator') productsPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductsService,
              private messageService: MessagesService,
              private dialog : MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts() {
    this.productService.getProducts()
      .subscribe({
        next:(res)=>{
          this.productsDataSource = new MatTableDataSource(res);
          this.productsDataSource.paginator = this.productsPaginator;
          this.productsDataSource.sort = this.sort;
        },
        error:()=>{
          this.productStatus = this.messageService.ERROR_PRODUCT_FETCH;
          console.log(this.productStatus);
        }
      })
  }

  deletePrompt(row : any) {
    this.dialog.open(DeletePromptProductsComponent, {
      width: '20%',
      data: row
    }).afterClosed().subscribe(val => {
      this.getProducts();
    })
  }

  updatePrompt(row : any) {
    this.dialog.open(UpdateProductFormComponent, {
      width: '50%',
      data: row
    }).afterClosed().subscribe(val=>{
      this.getProducts();
    })
  }

  addSingleProduct() {
    this.dialog.open(AddSingleProductFormComponent, {
      width:'50%',
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getProducts();
      }
    })
  }

  addMultipleProducts() {
    this.router.navigate(["products/add-multiple"]);
  }

  openCart() {}

  applyFilterProducts(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.productsDataSource.paginator) {
      this.productsDataSource.paginator.firstPage();
    }
  }

  openSaleFrom(row : any) {}

}
