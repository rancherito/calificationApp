import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadKeysComponent } from './pages/start/start.component';
import { LoadstudentsComponent } from "./pages/loadstudents/loadstudents.component";
import { Step3Component } from "./pages/step3/step3.component";
import { Step4Component } from "./pages/step4/step4.component";
import { ReportComponent } from './pages/report/report.component';
import { LoadprojectComponent } from './pages/loadproject/loadproject.component';
import { ReportStudentComponent } from './pages/report-student/report-student.component';
const routes: Routes = [
  { path: '', component: LoadprojectComponent },
  { path: 'loadkeys', component: LoadKeysComponent },
  { path: 'loadstudents', component: LoadstudentsComponent},
  { path: 'LoadIdentifiers', component: Step3Component },
  { path: 'loadAnswers', component: Step4Component },
  { path: 'report', component: ReportComponent },
  { path: 'infostudent/:project/:student', component: ReportStudentComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
