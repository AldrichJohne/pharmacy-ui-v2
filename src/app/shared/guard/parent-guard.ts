import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {UrlService} from "../services/url.service";

@Injectable({ providedIn: 'root' })
export class ParentGuard {
  router: Router;
  urlService: UrlService;

  constructor(
    private router_: Router,
    private urlService_: UrlService) {
    this.router = router_;
    this.urlService = urlService_;
  }

}
