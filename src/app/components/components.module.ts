import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoxComponent } from './box/box.component';
import { CardComponent } from './card/card.component';
import { RecoverdatalayoutComponent } from "./recoverdatalayout/recoverdatalayout.component";

import { ScrollPanelModule } from "primeng/scrollpanel";
import { LayoutBottomComponent } from './layout-bottom/layout-bottom.component';
import {ButtonModule} from 'primeng/button';
import { CardOutlinedComponent } from './card-outlined/card-outlined.component'
let comps = [
  BoxComponent,
  CardComponent,
  RecoverdatalayoutComponent,
  LayoutBottomComponent,
  CardOutlinedComponent
]
@NgModule({
  declarations: [...comps],
  exports: [...comps],
  imports: [
    CommonModule,
    ButtonModule,
    ScrollPanelModule,
    RouterModule
  ]
})
export class ComponentsModule { }
export interface CComponent {
  styleClass: string | undefined;
  style: Record<string, string> | undefined;
}