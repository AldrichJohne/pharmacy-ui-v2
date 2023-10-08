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
  DIALOG_PROMPT_WIDTH = '300px';

  STATUS_NOTIFY_OK = 'OK';
  STATUS_NOTIFY_ERROR = 'ERROR';

  CONST_CATEGORY = 'category';
  CONST_EXPR_DATE_TEMP_TS = 'expiryDateTemp';
  CONST_SAVE = 'save';
  CONST_CLASS_ID = 'classId';
  CONST_PHARMACIST = 'pharmacist';
  CONST_PRODUCT_ID = 'productId'
  CONST_SALE = 'sale';
  CONST_NEW_INVOICE = 'newInvoice';
  CONST_SOLD_QTY = 'soldQuantity';
  CONST_TXN_DATE_TEMP = 'transactionDateTemp';
  CONST_TXN_DATE = 'transactionDate';
  CONS_DISCOUNTED = 'isDiscounted';
  CONS_CLASSIFICATION = 'classification';
  CONST_PRODUCT_NAME = 'productName';
  CONST_PRICE = 'price';
  CONST_SRP = 'srp';
  CONST_CLASS = 'class';
  CONST_QTY = 'quantity';
  CONST_ACTION = 'actions';
  CONST_PAYMENT = 'payment';

  BUTTON_TRIGGER_SAVE = 'SAVE_BUTTON';
  BUTTON_TRIGGER_CLEAR = 'CLEAR_TABLE_BUTTON';
  BUTTON_TRIGGER_CLOSE = 'CLOSE_PAGE_BUTTON';

  CATEGORY_BRANDED = 'Branded';
  CATEGORY_GENERIC = 'Generic';
  CATEGORY_GENERIC_SMALL = 'generics';
  CATEGROY_GALENICALS = 'Galenical';
  CATEGORY_ICE_CREAM = 'Ice Cream';
  CATEGORY_OTHER = 'Others';
}
