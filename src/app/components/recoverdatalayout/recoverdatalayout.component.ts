import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'co-recoverdatalayout',
  templateUrl: './recoverdatalayout.component.html',
  styleUrls: ['./recoverdatalayout.component.scss']
})
export class RecoverdatalayoutComponent implements OnInit {
  @Input() extend = false
  @Input() label = "Your title"
  constructor() { }

  ngOnInit(): void {
  }

}
