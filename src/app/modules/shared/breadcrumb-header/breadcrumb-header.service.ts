import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()
export class BreadcrumbHeaderService {
  private breadcrumbTitleSource = new Subject<string>();
  breadcrumbHeaderTitle$ = this.breadcrumbTitleSource.asObservable();

  constructor() {
  }

  setBreadcrumbTitle(title: any) {
    this.breadcrumbTitleSource.next(title);
  }
}
