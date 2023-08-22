import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import {UrlService} from "./shared/services/url.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ProductPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [UrlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
