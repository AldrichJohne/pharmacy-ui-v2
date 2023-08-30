import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-notify-prompt',
  templateUrl: './notify-prompt.component.html',
  styleUrls: ['./notify-prompt.component.scss']
})
export class NotifyPromptComponent implements OnInit {

  message : any;
  icon : any;

  constructor(@Inject(MAT_DIALOG_DATA) public notifData : any) { }

  ngOnInit(): void {
    this.message = this.notifData.notifyMessage;
    this.checkNotificationStatus();
  }

  checkNotificationStatus() {
    if (this.notifData.notifyStatus == 'OK') {
      this.icon = 'sentiment_very_satisfied';
    } else {
      this.icon = 'sentiment_very_dissatisfied';
    }
  }

}
