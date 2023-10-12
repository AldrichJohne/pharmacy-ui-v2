import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import {UrlService} from "./shared/services/url.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatTabsModule} from "@angular/material/tabs";
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {MatMenuModule} from "@angular/material/menu";
import {MatGridListModule} from "@angular/material/grid-list";
import { AddSingleProductFormComponent } from './components/product-page/add-single-product-form/add-single-product-form.component';
import { NotifyPromptComponent } from './shared/notify-prompt/notify-prompt.component';
import { DeletePromptProductsComponent } from './components/product-page/delete-prompt-products/delete-prompt-products.component';
import { UpdateProductFormComponent } from './components/product-page/update-product-form/update-product-form.component';
import { AddMultipleProductsPageComponent } from './components/product-page/add-multiple-products-page/add-multiple-products-page.component';
import { ConfirmationPromptComponent } from './components/product-page/add-multiple-products-page/confirmation-prompt/confirmation-prompt.component';
import {SaleFormComponent} from "./components/product-page/sale-form/sale-form.component";
import { CartPageComponent } from './components/product-page/cart-page/cart-page.component';
import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { ProductsSoldPageComponent } from './components/product-page/products-sold-page/products-sold-page.component';
import { DeletePromptSoldProductsComponent } from './components/product-page/products-sold-page/delete-prompt-sold-products/delete-prompt-sold-products.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ProductPageComponent,
    AddSingleProductFormComponent,
    NotifyPromptComponent,
    DeletePromptProductsComponent,
    UpdateProductFormComponent,
    AddMultipleProductsPageComponent,
    ConfirmationPromptComponent,
    SaleFormComponent,
    CartPageComponent,
    ErrorPageComponent,
    ProductsSoldPageComponent,
    DeletePromptSoldProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatMenuModule,
    MatGridListModule
  ],
  providers: [UrlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
