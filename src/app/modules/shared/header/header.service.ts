import {Injectable} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';


@Injectable()
export class HeaderService{
  private dashboardTitleSource = new Subject<string>();

  constructor() {
  }
  dashboardTitle$ = this.dashboardTitleSource.asObservable();

  setDashBoardTitle(title:any){
    this.dashboardTitleSource.next(title);
  }
}
