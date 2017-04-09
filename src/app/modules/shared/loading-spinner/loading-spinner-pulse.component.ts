import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'loading-spinner-pulse',
  styles: [`
    .pulse-spinner {
      margin: 25px auto;
      width: 40px;
      height: 40px;
      border-radius: 100%;

      -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
      animation: sk-scaleout 1.0s infinite ease-in-out;
    }

    @-webkit-keyframes sk-scaleout {
      0% {
        -webkit-transform: scale(0);
      }
      100% {
        -webkit-transform: scale(1.0);
        opacity: 0;
      }
    }

    @keyframes sk-scaleout {
      0% {
        -webkit-transform: scale(0);
        transform: scale(0);
      }
      100% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
        opacity: 0;
      }
    }
  `],
  template: `
    <div [hidden]="!visible" class="pulse-spinner" [style.backgroundColor]="color"></div>
  `
})
export class LoadingSpinnerPulseComponent extends SpinnerComponent {

  constructor() { super(); }

}
