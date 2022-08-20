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
import { DividerModule } from 'primeng/divider';

import { FormsModule } from '@angular/forms';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { ComponentsModule } from "../components/components.module";
import { loadIdentifier } from './step3/loadIdentifier.component';
import { Step4Component } from './step4/step4.component';
import { ReportComponent } from './report/report.component';
import { CoModalityListComponent } from './report/co-modality-list/co-modality-list.component';
import { LoadprojectComponent } from './loadproject/loadproject.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { ReportStudentComponent } from './report-student/report-student.component';
import { PanelModule } from 'primeng/panel';
import { ReportVacanciesComponent } from './report-vacancies/report-vacancies.component';

let comps: any[] = [
  LoadKeysComponent,
  LoadstudentsComponent
]

@NgModule({
  declarations: [...comps, loadIdentifier, Step4Component, ReportComponent, CoModalityListComponent, LoadprojectComponent, ReportStudentComponent, ReportVacanciesComponent],
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
    RadioButtonModule,
    PanelModule,
    DividerModule
  ]
})
export class PagesModule { }
