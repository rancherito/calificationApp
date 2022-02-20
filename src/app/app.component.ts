import { Component, OnInit, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { DatastorageService } from './datastorage/datastorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    private primengConfig: PrimeNGConfig,
    private store: DatastorageService
    ) { 
      this.store.reLocationPage()
    }
  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
  title = 'calificationApp';
}
