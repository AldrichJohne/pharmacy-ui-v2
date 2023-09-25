import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  TBL_HEADER_CASHIER_TS = 'cashier';
  TBL_HEADER_NAME_TS = 'name';
  TBL_HEADER_CLASS_NAME_TS = 'className';
  TBL_HEADER_REMAINING_STOCK_TS = 'remainingStock';
  TBL_HEADER_TOTAL_STOCK_TS = 'totalStock';
  TBL_HEADER_SOLD_TS = 'sold';
  TBL_HEADER_PRC_TS = 'pricePerPc';
  TBL_HEADER_SRP_TS = 'srpPerPc';
  TBL_HEADER_GROSS_TS = 'totalGross';
  TBL_HEADER_PROFIT_TS = 'profit';
  TBL_HEADER_EXPR_DATE_TS = 'expiryDate';
  TBL_HEADER_ACTION_TS = 'action';

  DIALOG_FORM_WIDTH = '50%';
  DIALOG_PROMPT_WIDTH = '20%';

  STATUS_NOTIFY_OK = 'OK';
  STATUS_NOTIFY_ERROR = 'ERROR';

  CONST_CATEGORY = 'category';
  CONST_EXPR_DATE_TEMP_TS = 'expiryDateTemp';
  CONST_SAVE = 'save';
  CONST_CLASS_ID = 'classId';

  BUTTON_TRIGGER_SAVE = 'SAVE_BUTTON';
  BUTTON_TRIGGER_CLEAR = 'CLEAR_TABLE_BUTTON';
  BUTTON_TRIGGER_CLOSE = 'CLOSE_PAGE_BUTTON';

  CATEGORY_BRANDED = 'Branded';
  CATEGORY_GENERIC = 'Generic';
  CATEGROY_GALENICALS = 'Galenical';
  CATEGORY_ICE_CREAM = 'Ice Cream';
  CATEGORY_OTHER = 'Others';
}
