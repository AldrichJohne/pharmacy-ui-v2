import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductPageUtilService {

  constructor() { }

  confirmationPromptTrigger = new Subject<any>();
}
