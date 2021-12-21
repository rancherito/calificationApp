import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestComponent } from './test/test.component';
import { LoadstudentsComponent } from './loadstudents/loadstudents.component';
import { StartComponent } from './start/start.component';

//IMPORT PRIMENG MODULES
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TableModule } from "primeng/table";
import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';

import { FormsModule } from '@angular/forms';

import { ComponentsModule } from "../components/components.module";
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { ReportDataComponent } from './report-data/report-data.component';
let comps: any[] = [

  StartComponent,
  TestComponent,
  LoadstudentsComponent
]

@NgModule({
  declarations: [...comps, Step3Component, Step4Component, ReportDataComponent],
  exports: [...comps],
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ScrollPanelModule,
    TableModule,
    ChipModule,
    CheckboxModule,
    ComponentsModule,
    RouterModule
  ]
})
export class PagesModule { }