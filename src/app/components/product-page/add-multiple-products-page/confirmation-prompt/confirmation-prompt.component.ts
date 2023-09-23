import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProductsService} from "../../products.service";
import {ProductPageUtilService} from "../../product-page-util.service";

@Component({
  selector: 'app-confirmation-prompt',
  templateUrl: './confirmation-prompt.component.html',
  styleUrls: ['./confirmation-prompt.component.scss']
})
export class ConfirmationPromptComponent implements OnInit {

  message = '';
  triggeredBy = '';
  okButtonColor = 'warn';

  constructor(@Inject(MAT_DIALOG_DATA) public data : any,
              private dialogRef : MatDialogRef<ConfirmationPromptComponent>,
              public productPageUtilService: ProductPageUtilService) { }

  ngOnInit(): void {
    this.message = this.data.message;
    this.triggeredBy = this.data.triggeredBy;
    if(this.data.triggeredBy == 'SAVE_BUTTON') {
      this.okButtonColor = 'primary';
    }
  }

  closePrompt() {
    this.dialogRef.close();
  }

  proceed() {
    this.productPageUtilService.confirmationPromptTrigger.next(this.triggeredBy);
    this.message = '';
    this.triggeredBy = '';
    this.closePrompt();
  }

}
