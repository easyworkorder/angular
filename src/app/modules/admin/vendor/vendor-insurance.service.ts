import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";

@Injectable()
export class UpdateVendorInsuranceService {
    updateInsuranceInfoSource = new Subject<string>();
    updateInsuranceInfo$ = this.updateInsuranceInfoSource.asObservable();

    setUpdateInsurance(data: any) {
        this.updateInsuranceInfoSource.next(data);
    }
}