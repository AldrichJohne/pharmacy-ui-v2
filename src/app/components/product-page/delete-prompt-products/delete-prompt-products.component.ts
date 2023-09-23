import {Component, Inject, OnInit} from '@angular/core';
import {ProductsService} from "../products.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import {MessagesService} from "../../../shared/services/messages.service";

@Component({
  selector: 'app-delete-prompt-products',
  templateUrl: './delete-prompt-products.component.html',
  styleUrls: ['./delete-prompt-products.component.scss']
})
export class DeletePromptProductsComponent implements OnInit {

  productName = '';
  notifyMessage = '';
  notifyStatus = '';

  constructor(private productService: ProductsService,
              private messageService: MessagesService,
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
          this.notifyStatus = 'OK';
          this.OpenNotifyDialog();
          this.dialogRef.close()
        },
        error:()=>{
          this.notifyMessage = this.messageService.ERROR_PRODUCT_DELETE;
          this.notifyStatus = 'ERROR';
          this.OpenNotifyDialog();
          this.dialogRef.close()
        }
      })
  }

  OpenNotifyDialog() {
    this.dialog.open(NotifyPromptComponent, {
      width: '20%',
      data: { notifyMessage: this.notifyMessage, notifyStatus: this.notifyStatus }
    });
  }

}
