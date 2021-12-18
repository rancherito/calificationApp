import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './pages/start/start.component';
import { CardComponent } from './components/card/card.component';

//IMPORT PRIMENG MODULES
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TableModule } from "primeng/table";
import { ChipModule } from 'primeng/chip';

//IMPORT PROJECT MODULES AND COMPONENTS
import { BoxComponent } from './components/box/box.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './pages/test/test.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { LoadstudentsComponent } from './pages/loadstudents/loadstudents.component';
import { RecoverdatalayoutComponent } from './components/recoverdatalayout/recoverdatalayout.component';
@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    CardComponent,
    BoxComponent,
    TestComponent,
    LoadstudentsComponent,
    RecoverdatalayoutComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    CheckboxModule,
    ScrollPanelModule,
    TableModule,
    ChipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
