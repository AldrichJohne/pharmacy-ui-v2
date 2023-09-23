import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  public readonly OK_PRODUCT_DELETE = 'Product deleted successfully.';
  public readonly OK_PRODUCT_ADD = 'Product added successfully.';
  public readonly OK_PRODUCT_UPDATE = 'Product updated successfully.';
  public readonly OK_TABLE_CLEARED = 'Table is cleared.';
  public readonly ERROR_PRODUCT_ADD = 'Error adding product.';
  public readonly ERROR_PRODUCT_UPDATE = 'Error updating product.';
  public readonly ERROR_REQUIRED_FIELD = 'Missing required field(s).';
  public readonly ERROR_PRODUCT_ON_LIST = 'There is no product present in the list.';
  public readonly ERROR_PRODUCT_DELETE = 'Error deleting product.';
  public readonly ERROR_CAPITAL_SRP = 'Capital should be smaller than SRP.';
  public readonly ERROR_TOTAL_STOCK_SOLD = 'You can\'t make total stock lesser than sold; it will become negative.';
  public readonly ERROR_PRODUCT_FETCH = 'Error while fetching the products.';
  public readonly QUESTION_CLEAR_DATA = 'Are you sure you want to clear all data from the table and not save them?';
  public readonly QUESTION_PRODUCT_SAVE = 'Are you sure you want to save the product(s) to the database?';
  public readonly QUESTION_CLOSE_PAGE = 'Are you sure you want to close the page? The table data will disappear when closed.';

}
