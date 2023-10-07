import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {ProductPageComponent} from "./components/product-page/product-page.component";
import {AddMultipleProductsPageComponent} from "./components/product-page/add-multiple-products-page/add-multiple-products-page.component";
import {CartPageComponent} from "./components/product-page/cart-page/cart-page.component";
import {RouterGuard} from "./shared/guard/router-guard";
import {ErrorPageComponent} from "./shared/error-page/error-page.component";

const routes: Routes = [
  { path: 'login', component: LoginPageComponent},
  { path: 'products', component: ProductPageComponent, canActivate: [RouterGuard]},
  { path: 'products/add-multiple', component: AddMultipleProductsPageComponent, canActivate: [RouterGuard]},
  { path: 'products/cart', component: CartPageComponent, canActivate: [RouterGuard]},
  { path: 'error', component: ErrorPageComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
