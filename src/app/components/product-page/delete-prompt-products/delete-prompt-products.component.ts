import {Component, Inject, OnInit} from '@angular/core';
import {ProductsHttpService} from "../services/products-http.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import {MessagesService} from "../../../shared/services/messages.service";
import {ConstantsService} from "../../../shared/services/constants.service";

@Component({
  selector: 'app-delete-prompt-products',
  templateUrl: './delete-prompt-products.component.html',
  styleUrls: ['./delete-prompt-products.component.scss']
})
export class DeletePromptProductsComponent implements OnInit {

  productName = '';

  constructor(private productService: ProductsHttpService,
              private messageService: MessagesService,
              private constantService: ConstantsService,
              @Inject(MAT_DIALOG_DATA) public deleteData : any,
              private dialogRef : MatDialogRef<DeletePromptProductsComponent>,
              private dialog : MatDialog) { }

  ngOnInit(): void {
    this.productName = this.deleteData.name;
  }

  continueDelete() {
    return this.productService.deleteProduct(this.deleteData.id)
      .subscribe({
        next: () => {
          this.OpenNotifyDialog(this.messageService.SUCCESS_PRODUCT_DELETE, 'OK');
          this.dialogRef.close()
        },
        error:()=>{
          this.OpenNotifyDialog(this.messageService.ERROR_FAILED_TO_DELETE_PRODUCT, 'ERROR');
          this.dialogRef.close()
        }
      })
  }

  OpenNotifyDialog(message: string, status: string) {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: message, notifyStatus: status }
    });
  }

}
