import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxComponent } from './box/box.component';
import { CardComponent } from './card/card.component';
import { RecoverdatalayoutComponent } from "./recoverdatalayout/recoverdatalayout.component";

import { ScrollPanelModule } from "primeng/scrollpanel";
import { LayoutBottomComponent } from './layout-bottom/layout-bottom.component';
let comps = [
  BoxComponent,
  CardComponent,
  RecoverdatalayoutComponent,
  LayoutBottomComponent
]
@NgModule({
  declarations: [...comps],
  exports: [...comps],
  imports: [
    CommonModule,
    ScrollPanelModule
  ]
})
export class ComponentsModule { }
export interface CComponent {
  styleClass: string | undefined;
}