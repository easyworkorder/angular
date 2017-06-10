import { Component, OnInit, Input } from '@angular/core';
import { PagerService } from "app/services/pager.service";
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'ewo-next-prev-pager',
  template: `
    <!-- <div class="text-center">
         <ul *ngIf="pagerService.pager.pages && pagerService.pager.pages.length" class="pagination">
             <li [ngClass]="{disabled:pager.currentPage === 1}">
                 <a (click)="pagerService.setPage(pager.currentPage - 1)"><i class="fa fa-chevron-left"></i></a>
             </li>
             <li [ngClass]="{active:pagerService.pager.currentPage}">
                 <a (click)="pagerService.setPage(pagerService.pager.currentPage)">{{pagerService.pager.currentPage}}</a>
             </li>
             <li [ngClass]="{disabled:pagerService.pager.currentPage === pagerService.pager.totalPages}">
                 <a (click)="pagerService.setPage(pagerService.pager.currentPage + 1)"><i class="fa fa-chevron-right"></i></a>
             </li>
         </ul>
     </div> -->

     <div>
        <a [ngClass]="{disabled:pagerService.pager.currentPage === 1}" (click)="pagerService.setPage(pagerService.pager.currentPage - 1, _items)" class="btn btn-effect-ripple btn-default" style="overflow: hidden; position: relative;"><i class="fa fa-arrow-left"></i> Prev</a>
        <a [ngClass]="{disabled:pagerService.pager.currentPage === pagerService.pager.totalPages}" (click)="pagerService.setPage(pagerService.pager.currentPage + 1, _items)" class="btn btn-effect-ripple btn-default" style="overflow: hidden; position: relative;">Next <i class="fa fa-arrow-right"></i></a>
    </div>
  `,
})
export class NextPrevPagerComponent implements OnInit {
  @Input() items: Subject<any>;

  _items: any = [];

  constructor(
    private pagerService: PagerService
  ) { }

  ngOnInit () {

    this.items.subscribe(data => {
      this._items = data;
    })
  }

}
