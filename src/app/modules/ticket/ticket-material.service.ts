import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";

@Injectable()
export class UpdateTicketMaterialService {
    updateMaterialInfoSource = new Subject<string>();
    updateMaterialInfo$ = this.updateMaterialInfoSource.asObservable();

    setUpdateMaterial(data: any) {
        this.updateMaterialInfoSource.next(data);
    }
}