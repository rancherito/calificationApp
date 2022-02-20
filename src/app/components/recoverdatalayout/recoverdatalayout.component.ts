import { Component, Input, OnInit } from '@angular/core';
import { DatastorageService, IProject } from 'src/app/datastorage/datastorage.service';

@Component({
  selector: 'co-recoverdatalayout',
  templateUrl: './recoverdatalayout.component.html',
  styleUrls: ['./recoverdatalayout.component.scss']
})
export class RecoverdatalayoutComponent implements OnInit {
  @Input() extend = false
  @Input() label = "Your title"
  public currentProject: IProject | null = null;
  constructor(
    private storage: DatastorageService
  ) { }
  ngOnInit(): void {
    this.storage.getCurrentProject().subscribe(e => this.currentProject = e)
  }

}
