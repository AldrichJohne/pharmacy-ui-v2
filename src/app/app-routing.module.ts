import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {ProductPageComponent} from "./components/product-page/product-page.component";
import {AddMultipleProductsPageComponent} from "./components/product-page/add-multiple-products-page/add-multiple-products-page.component";
import {CartPageComponent} from "./components/product-page/cart-page/cart-page.component";

const routes: Routes = [
  { path: '', component: LoginPageComponent},
  { path: 'products', component: ProductPageComponent},
  { path: 'products/add-multiple', component: AddMultipleProductsPageComponent},
  { path: 'products/cart', component: CartPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
