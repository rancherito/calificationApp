import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { LoadstudentsComponent } from "./pages/loadstudents/loadstudents.component";
const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'loadstudents', component: LoadstudentsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
