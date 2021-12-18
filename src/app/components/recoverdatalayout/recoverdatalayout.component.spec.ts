import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverdatalayoutComponent } from './recoverdatalayout.component';

describe('RecoverdatalayoutComponent', () => {
  let component: RecoverdatalayoutComponent;
  let fixture: ComponentFixture<RecoverdatalayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverdatalayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverdatalayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
