import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadprojectComponent } from './loadproject.component';

describe('LoadprojectComponent', () => {
  let component: LoadprojectComponent;
  let fixture: ComponentFixture<LoadprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadprojectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
