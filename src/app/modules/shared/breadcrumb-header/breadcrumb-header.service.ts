import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class BreadcrumbHeaderService {
  private breadcrumbTitleSource = new Subject<string>();
  breadcrumbHeaderTitle$ = this.breadcrumbTitleSource.asObservable();

  private showBreadCrumbSource = new Subject<boolean>();
  showBreadCrumb$ = this.showBreadCrumbSource.asObservable();


  constructor() {
    this.setShowBreadCrumb(true);
  }

  setBreadcrumbTitle (title: any) {
    this.breadcrumbTitleSource.next(title);
  }

  setShowBreadCrumb (value) {
    this.showBreadCrumbSource.next(value);
  }
}
