import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxComponent } from './box/box.component';
import { CardComponent } from './card/card.component';
import { RecoverdatalayoutComponent } from "./recoverdatalayout/recoverdatalayout.component";

import { ScrollPanelModule } from "primeng/scrollpanel";
let comps = [
  BoxComponent,
  CardComponent,
  RecoverdatalayoutComponent,
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