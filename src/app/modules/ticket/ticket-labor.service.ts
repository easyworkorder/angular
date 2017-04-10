import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";

@Injectable()
export class UpdateTicketLaborService {
    updateLaborInfoSource = new Subject<string>();
    updateLaborInfo$ = this.updateLaborInfoSource.asObservable();

    setUpdateLabor(data: any) {
        this.updateLaborInfoSource.next(data);
    }
}