import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { LoadstudentsComponent } from "./pages/loadstudents/loadstudents.component";
import { Step3Component } from "./pages/step3/step3.component";
import { Step4Component } from "./pages/step4/step4.component";
import { ReportComponent } from './pages/report/report.component';
import { LoadprojectComponent } from './pages/loadproject/loadproject.component';
const routes: Routes = [
  { path: '', component: LoadprojectComponent },
  { path: 'loadkeys', component: StartComponent },
  { path: 'loadstudents', component: LoadstudentsComponent},
  { path: 'step3', component: Step3Component },
  { path: 'step4', component: Step4Component },
  { path: 'report', component: ReportComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
