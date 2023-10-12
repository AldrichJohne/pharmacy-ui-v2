import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {CashierHttpService} from "../services/cashier-http.service";
import {MatDialog} from "@angular/material/dialog";
import {DeletePromptSoldProductsComponent} from "./delete-prompt-sold-products/delete-prompt-sold-products.component";
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";

@Component({
  selector: 'app-products-sold-page',
  templateUrl: './products-sold-page.component.html',
  styleUrls: ['./products-sold-page.component.scss']
})
export class ProductsSoldPageComponent {
  notifyMessage = '';
  notifyStatus = '';
  eventEmitter = false;

  displayedColumnsSales: string[] = ['pharmacist', 'name','classification','price','srp','sold','amount','profit','isDiscounted', 'invoiceCode','transactionDate', 'action'];
  dataSourceSales!: MatTableDataSource<any>;
  @ViewChild('salesPaginator') salesPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cashierService: CashierHttpService,
              private dialog : MatDialog) {
  }

  ngOnInit(): void {
    this.getAllSales();
  }

  emitGetAllProducts() {
    // this.shareEventService.refreshProductTab.next(true);
  }

  getAllSales() {
    this.cashierService.getProductSales()
      .subscribe({
        next:(res)=>{
          this.dataSourceSales = new MatTableDataSource(res);
          this.dataSourceSales.paginator = this.salesPaginator;
          this.dataSourceSales.sort = this.sort;
        },
        error:()=>{
          this.openNotifyDialog("Error While Fetching The Product Sales", 'ERROR');
        }
      })
  }

  applyFilterSales(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSales.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceSales.paginator) {
      this.dataSourceSales.paginator.firstPage();
    }
  }

  openNotifyDialog(message: String, status: String) {
    this.dialog.open(NotifyPromptComponent, {
      width: '20%',
      data: { notifyMessage: message, notifyStatus: status }
    });
  }

  openDeletePrompt(row : any) {
    this.dialog.open(DeletePromptSoldProductsComponent, {
      width: '20%',
      data: row
    }).afterClosed().subscribe(val => {
      this.getAllSales();
      this.emitGetAllProducts();
    })
  }
}
