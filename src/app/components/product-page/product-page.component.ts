import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ProductsService} from "./products.service";
import {MatDialog} from "@angular/material/dialog";
import {AddSingleProductFormComponent} from "./add-single-product-form/add-single-product-form.component";

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
              private dialog : MatDialog) { }

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
          this.productStatus = 'Error While Fetching The Products';
          console.log(this.productStatus);
        }
      })
  }

  deletePrompt(row : any) {}

  updatePrompt(row : any) {}

  addSingleProduct() {
    this.dialog.open(AddSingleProductFormComponent, {
      width:'50%',
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getProducts();
      }
    })
  }

  addMultipleProducts() {}

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
