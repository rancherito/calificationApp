import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadstudentsComponent } from './loadstudents/loadstudents.component';
import { LoadKeysComponent } from './start/start.component';


//IMPORT PRIMENG MODULES
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TableModule } from "primeng/table";
import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';

import { FormsModule } from '@angular/forms';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { ComponentsModule } from "../components/components.module";
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { ReportComponent } from './report/report.component';
import { CoModalityListComponent } from './report/co-modality-list/co-modality-list.component';
import { LoadprojectComponent } from './loadproject/loadproject.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { ReportStudentComponent } from './report-student/report-student.component';
let comps: any[] = [
  LoadKeysComponent,
  LoadstudentsComponent
]

@NgModule({
  declarations: [...comps, Step3Component, Step4Component, ReportComponent, CoModalityListComponent, LoadprojectComponent, ReportStudentComponent],
  exports: [...comps, ReportComponent],
  imports: [
    DropdownModule,
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
    RouterModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    ChartModule,
    CodemirrorModule,
    DialogModule,
    RadioButtonModule
  ]
})
export class PagesModule { }
