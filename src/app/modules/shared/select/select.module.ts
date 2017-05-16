import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectComponent } from './select';
import { HighlightPipe } from './select-pipes';
import { OffClickDirective } from './off-click';
// import { SafePipe } from "app/pipes";
import { SafeHtmlPipe } from "app/modules/shared/select/safe-html.pipe";

@NgModule({
  imports: [CommonModule],
  declarations: [SelectComponent, HighlightPipe, SafeHtmlPipe, OffClickDirective],
  exports: [SelectComponent, HighlightPipe, SafeHtmlPipe, OffClickDirective]
})
export class SelectModule {
}
