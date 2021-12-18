import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadstudentsComponent } from './loadstudents.component';

describe('LoadstudentsComponent', () => {
  let component: LoadstudentsComponent;
  let fixture: ComponentFixture<LoadstudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadstudentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadstudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
