import { Component, Input, OnInit } from '@angular/core';
import { CComponent } from '../components.module';

@Component({
  selector: 'co-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements CComponent {
  @Input() styleClass: string | undefined;

  constructor() { }
  ngOnInit(): void {
  }

}

