import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'spinner',
  template: ''
})
export class SpinnerComponent implements OnDestroy {
  public visible: boolean = true;
  public timeout: any;
  public baseClass: string = 'chasing-dots-spinner';
  public childClass: string = 'dot';
  public numItems: number = 2;

  @Input()
  public delay: number = 0;

  @Input()
  public color: string = '#333';

  @Input()
  public set isRunning(value: boolean) {
    if (!value) {
      this.cancel();
      this.visible = false;
      return;
    }

    if (this.timeout) {
      return;
    }

    this.timeout = setTimeout(() => {
      this.visible = true;
      this.cancel();
    }, this.delay);
  }

  private cancel(): void {
    clearTimeout(this.timeout);
    this.timeout = undefined;
  }

  public get items() {
    return Array(this.numItems);
  }

  ngOnDestroy(): any {
    this.cancel();
  }
}

export const SpinnerTemplate = `
  <div [hidden]="!visible" [ngClass]="baseClass">
      <div *ngFor="let item of items; let i = index" [ngClass]="childClass + (i+1)" [style.backgroundColor]="color"></div>
  </div>
`;