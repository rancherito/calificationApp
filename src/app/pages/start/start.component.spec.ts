import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadKeysComponent } from './start.component';

describe('StartComponent', () => {
  let component: LoadKeysComponent;
  let fixture: ComponentFixture<LoadKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadKeysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
