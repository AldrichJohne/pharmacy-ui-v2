import { Injectable } from '@angular/core';
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private isloggedIn: boolean;

  constructor() {
    this.isloggedIn=false;
  }

  login(username: string, password:string) {

    if (username === 'nova' && password === 'nova') {
      this.isloggedIn= true;
    }
    return of(this.isloggedIn);
  }

  isUserLoggedIn(): boolean {
    return this.isloggedIn;
  }

  logoutUser(): void{
    this.isloggedIn = false;
  }

}
