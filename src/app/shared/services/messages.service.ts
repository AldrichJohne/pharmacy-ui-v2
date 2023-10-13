import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  public readonly SUCCESS_PRODUCT_DELETE = 'Product has been successfully deleted.';
  public readonly SUCCESS_PRODUCT_ADD = 'Product has been added successfully.';
  public readonly SUCCESS_PRODUCT_UPDATE = 'Product has been updated successfully.';
  public readonly SUCCESS_TABLE_CLEARED = 'The table has been cleared.';
  public readonly SUCCESS_PRODUCT_ADDED_TO_CART = 'Product has been added to the cart successfully.';
  public readonly SUCCESS_PRODUCT_SOLD = 'Product sale was successful.';
  public readonly ERROR_INSUFFICIENT_PAYMENT = 'Payment must be equal to or greater than the total price.';
  public readonly ERROR_INVALID_CREDENTIALS = 'Invalid credentials. Please try again.';
  public readonly ERROR_FAILED_TO_SAVE_SALE = 'Failed to save the sale.';
  public readonly ERROR_FAILED_TO_FETCH_SALE_RECORDS = 'Error while fetching sale records.';
  public readonly ERROR_FAILED_TO_ADD_PRODUCT = 'Failed to add the product.';
  public readonly ERROR_FAILED_TO_UPDATE_PRODUCT = 'Failed to update the product.';
  public readonly ERROR_MISSING_REQUIRED_FIELDS = 'One or more required fields are missing.';
  public readonly ERROR_NO_PRODUCTS_IN_LIST = 'There are no products in the list.';
  public readonly ERROR_FAILED_TO_DELETE_PRODUCT = 'Failed to delete the product.';
  public readonly ERROR_CAPITAL_GREATER_THAN_SRP = 'The capital price must be lower than the suggested retail price (SRP).';
  public readonly ERROR_FAILED_TO_SAVE_PDF = 'An error occurred while saving the PDF.';
  public readonly ERROR_FAILED_TO_FETCH_REPORTS = 'Error while fetching report data for the date range: ';
  public readonly ERROR_INSUFFICIENT_STOCK = 'Insufficient stock available to fulfill your request. Please adjust the quantity and try again.';
  public readonly ERROR_TOTAL_STOCK_LESSER_THAN_SOLD = 'The total stock cannot be less than the quantity sold, as it would result in a negative value.';
  public readonly ERROR_FAILED_TO_FETCH_PRODUCTS = 'Error while fetching the product data.';
  public readonly CONFIRM_CLEAR_DATA = 'Are you sure you want to clear all data from the table without saving?';
  public readonly CONFIRM_SAVE_PRODUCT = 'Are you sure you want to save the product(s) to the database?';
  public readonly CONFIRM_CLOSE_PAGE = 'Are you sure you want to close the page? All table data will be lost upon closing.';
}
