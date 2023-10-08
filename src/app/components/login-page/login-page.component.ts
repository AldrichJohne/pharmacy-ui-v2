import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "./login.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessagesService} from "../../shared/services/messages.service";
import {ConstantsService} from "../../shared/services/constants.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NotifyPromptComponent} from "../../shared/notify-prompt/notify-prompt.component";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{

  loginForm!: FormGroup;
  hidePassword = true;

  constructor(private formBuilder : FormBuilder,
              private loginService: LoginService,
              private router: Router,
              private dialog : MatDialog,
              private constantService: ConstantsService,
              private messageService: MessagesService) { }

  ngOnInit(): void {
    this.loginForm.reset();
    this.loginService.logoutUser();
    this.loginForm = this.formBuilder.group({
      username: ['',Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    this.loginService.login(
      this.loginForm.controls['username'].value,
      this.loginForm.controls['password'].value)
    if (this.loginService.isUserLoggedIn()) {
      this.loginForm.reset();
      this.router.navigate(["products"])
    } else {
      this.openNotifyDialog(
        this.messageService.ERROR_INVALID_CRED,
        this.constantService.STATUS_NOTIFY_ERROR)
      setTimeout(() => {
        this.loginForm.reset();
      }, 1000);
    }
  }

  openNotifyDialog(message: string, status: string) {
    this.dialog.open(NotifyPromptComponent, {
      width: this.constantService.DIALOG_PROMPT_WIDTH,
      data: { notifyMessage: message, notifyStatus: status }
    });
  }

}
