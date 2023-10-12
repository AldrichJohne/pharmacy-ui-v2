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
  notifyMessage = '';
  notifyStatus = '';

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
          this.notifyMessage = this.messageService.OK_PRODUCT_DELETE;
          this.notifyStatus = this.constantService.STATUS_NOTIFY_OK;
          this.OpenNotifyDialog();
          this.dialogRef.close()
        },
        error:()=>{
          this.notifyMessage = this.messageService.ERROR_PRODUCT_DELETE;
          this.notifyStatus = this.constantService.STATUS_NOTIFY_ERROR;
          this.OpenNotifyDialog();
          this.dialogRef.close()
        }
      })
  }

  OpenNotifyDialog() {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

}
