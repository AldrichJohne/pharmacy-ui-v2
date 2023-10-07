import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "./login.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit{

  username: string = "";
  password: string = "";
  showLoginStatusMessage: boolean = false;
  hidePassword: boolean = true;
  loginStatus = 1;

  constructor(private router: Router,
              private loginService: LoginService) { }

  ngOnInit(): void {
        this.loginService.logoutUser();
    }

  submit() {
    this.loginService.login(this.username, this.password)
    if (this.loginService.isUserLoggedIn()) {
      this.router.navigate(["products"])
    } else {
      setTimeout(() => {
        this.clear();
      }, 1000);
    }

  }

  clear() {
    this.username = "";
    this.password = "";
    this.showLoginStatusMessage = true;

    setTimeout(() => {
      this.showLoginStatusMessage = false;
    }, 3000);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
