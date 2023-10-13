import { Component } from '@angular/core';
import {NotifyPromptComponent} from "../../../shared/notify-prompt/notify-prompt.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ReportsHttpService} from "../services/reports-http.service";
import * as moment from 'moment';
import {MessagesService} from "../../../shared/services/messages.service";
import {ConstantsService} from "../../../shared/services/constants.service";

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss']
})
export class ReportsPageComponent {
  notifyMessage = '';
  notifyStatus = '';

  dateRangeReportForm!: FormGroup;
  reportDateRangeValue: string = "MMM-DD-YYYY - MMM-DD-YYYY";
  reportGrossValue: string = "0.00";
  reportProfitValue: string = "0.00";
  brandedGross: string = "0.00";
  genericsGross: string = "0.00";
  galenicalsGross: string = "0.00";
  iceCreamGross: string = "0.00";
  othersGross: string = "0.00";
  brandedProfit: string = "0.00";
  genericsProfit: string = "0.00";
  galenicalsProfit: string = "0.00";
  iceCreamProfit: string = "0.00";
  othersProfit: string = "0.00";

  constructor(private reportHttpService: ReportsHttpService,
              private formBuilder : FormBuilder,
              private messageService: MessagesService,
              private constantService: ConstantsService,
              private dialog : MatDialog) { }

  ngOnInit(): void {
    this.dateRangeReportForm = this.formBuilder.group({
      startDateTemp: ['',Validators.required],
      endDateTemp: ['',Validators.required]
    });
  }

  findReportRecord() {
    this.dateRangeReportForm.enable();
    const convertedStartDate = moment(this.dateRangeReportForm.value.startDateTemp).format('YYYY-MM-DD');
    const convertedEndDate = moment(this.dateRangeReportForm.value.endDateTemp).format('YYYY-MM-DD');
    this.reportHttpService.getReportByDateRange(convertedStartDate, convertedEndDate).subscribe(
      {
        next:(res)=>{
          this.reportDateRangeValue = res.date;
          this.reportGrossValue = res.gross;
          this.reportProfitValue = res.profit;
          this.dateRangeReportForm.reset();
          this.setUpReport(res);
        },
        error:()=>{
          const message = this.messageService.ERROR_FAILED_TO_FETCH_REPORTS + convertedStartDate + " to " + convertedEndDate;
          this.OpenNotifyDialog(message, 'ERROR');
        }
      }
    )
  }

  private setUpReport(res: any): void {
    const { breakdown } = res;
    const [
      { gross: brandedGross, profit: brandedProfit },
      { gross: genericsGross, profit: genericsProfit },
      { gross: galenicalsGross, profit: galenicalsProfit },
      { gross: iceCreamGross, profit: iceCreamProfit },
      { gross: othersGross, profit: othersProfit }
    ] = breakdown;

    this.brandedGross = brandedGross;
    this.genericsGross = genericsGross;
    this.galenicalsGross = galenicalsGross;
    this.iceCreamGross = iceCreamGross;
    this.othersGross = othersGross;
    this.brandedProfit = brandedProfit;
    this.genericsProfit = genericsProfit;
    this.galenicalsProfit = galenicalsProfit;
    this.iceCreamProfit = iceCreamProfit;
    this.othersProfit = othersProfit;
  }

  reportClearAllCards() {
    this.reportDateRangeValue = "MMM-DD-YYYY - MMM-DD-YYYY";
    this.reportGrossValue = "0.00";
    this.reportProfitValue = "0.00";
    this.brandedGross = "0.00";
    this.genericsGross = "0.00";
    this.galenicalsGross = "0.00";
    this.iceCreamGross = "0.00";
    this.othersGross = "0.00";
    this.brandedProfit = "0.00";
    this.genericsProfit = "0.00";
    this.galenicalsProfit = "0.00";
    this.iceCreamProfit = "0.00";
    this.othersProfit = "0.00";
  }

  OpenNotifyDialog(message: string, status: string) {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: message, notifyStatus: status }
    });
  }
}
