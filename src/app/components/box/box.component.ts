import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'co-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {
  @Input() size: string = ".5rem";
  constructor() { }

  ngOnInit(): void {
  }

}
