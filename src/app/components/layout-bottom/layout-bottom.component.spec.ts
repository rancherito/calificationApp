import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutBottomComponent } from './layout-bottom.component';

describe('LayoutBottomComponent', () => {
  let component: LayoutBottomComponent;
  let fixture: ComponentFixture<LayoutBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutBottomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
