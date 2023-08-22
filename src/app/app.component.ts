import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {UrlService} from "./shared/services/url.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pharmacy-ui';

  previousUrl: string = '';
  currentUrl: string = '';

  constructor(private router: Router,
              private urlService: UrlService) {}

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      this.urlService.setPreviousUrl(this.previousUrl);
    });
  }
}
