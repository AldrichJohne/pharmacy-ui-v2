import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {LoginService} from "../../components/login-page/login.service";
import {NotifyPromptComponent} from "../notify-prompt/notify-prompt.component";
import {MatDialog} from "@angular/material/dialog";
import {ConstantsService} from "../services/constants.service";

@Injectable({ providedIn: 'root' })
export class RouterGuard implements CanActivate {

  notifyStatus = '';
  notifyMessage = '';

  constructor(private router:Router,
              private loginService: LoginService,
              private dialog : MatDialog,
              private constantService: ConstantsService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|UrlTree {

    if (!this.loginService.isUserLoggedIn()) {
      this.openNotifyDialog(
        "Please login to enter.",
        'ERROR'
      )
      this.router.navigate(["login"],{ queryParams: { reason: 'unauthenticated'} });
      return false;
    }

    return true;

  }

  openNotifyDialog(message: string, status: string) {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: message, notifyStatus: status }
    });
  }
}
