import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  activo = 1
  constructor() { }
  izquierda(): void{
    alert('izquierda');
    
  }

}
