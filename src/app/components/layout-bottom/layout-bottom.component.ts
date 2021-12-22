import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'co-layout-bottom',
  templateUrl: './layout-bottom.component.html',
  styleUrls: ['./layout-bottom.component.scss']
})
export class LayoutBottomComponent implements OnInit {

  @Input() wrapper = true
  constructor() { }

  ngOnInit(): void {
  }

}
