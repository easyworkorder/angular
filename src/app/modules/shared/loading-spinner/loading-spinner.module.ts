import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerWaveComponent } from "app/modules/shared/loading-spinner/loading-spinner-wave.component";
import { LoadingSpinnerPulseComponent } from "app/modules/shared/loading-spinner/loading-spinner-pulse.component";
import { LoadingSpinnerRotatingPlaneComponent } from "app/modules/shared/loading-spinner/loading-spinner-rotating-plane.component";
import { SpinnerComponent } from "app/modules/shared/loading-spinner/spinner.component";

const LOADING_COMPONENT = [
    SpinnerComponent,
    LoadingSpinnerWaveComponent,
    LoadingSpinnerPulseComponent,
    LoadingSpinnerRotatingPlaneComponent
]

@NgModule({
    imports: [CommonModule],
    exports: [LOADING_COMPONENT],
    declarations: [LOADING_COMPONENT]
})
export class LoadingSpinnerModule { }