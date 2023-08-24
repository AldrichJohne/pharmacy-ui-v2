import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  username: string = "";
  password: string = "";
  showLoginStatusMessage: boolean = false;
  hidePassword: boolean = true;
  loginStatus = 1;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  submit() {
    console.log("Username is " + this.username);
    console.log("Password is " + this.password);

    if (this.username == "nova" && this.password == "nova") {
      this.loginStatus = 0;
    } else {
      this.loginStatus = 1;
    }

    if (this.loginStatus == 0) {
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
