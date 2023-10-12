import {Component, Inject} from '@angular/core';
import {MessagesService} from "../../../../shared/services/messages.service";
import {ConstantsService} from "../../../../shared/services/constants.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NotifyPromptComponent} from "../../../../shared/notify-prompt/notify-prompt.component";
import {CashierHttpService} from "../../services/cashier-http.service";

@Component({
  selector: 'app-delete-prompt-sold-products',
  templateUrl: './delete-prompt-sold-products.component.html',
  styleUrls: ['./delete-prompt-sold-products.component.scss']
})
export class DeletePromptSoldProductsComponent {
  productName = '';

  constructor(private cashierHttpService: CashierHttpService,
              private messageService: MessagesService,
              private constantService: ConstantsService,
              @Inject(MAT_DIALOG_DATA) public deleteData : any,
              private dialogRef : MatDialogRef<DeletePromptSoldProductsComponent>,
              private dialog : MatDialog) { }

  ngOnInit(): void {
    this.productName = this.deleteData.name;
  }

  continueDelete() {
    return this.cashierHttpService.deleteProductSoldRecord(this.deleteData.id)
      .subscribe({
        next: () => {
          this.OpenNotifyDialog(
            this.messageService.OK_PRODUCT_DELETE,
            this.constantService.STATUS_NOTIFY_OK
          );
          this.dialogRef.close()
        },
        error:()=>{
          this.OpenNotifyDialog(
            this.messageService.ERROR_PRODUCT_DELETE,
            this.constantService.STATUS_NOTIFY_ERROR
          );
          this.dialogRef.close()
        }
      })
  }

  OpenNotifyDialog(message: String, status: String) {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: message, notifyStatus: status }
    });
  }
}
