import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoModalityListComponent } from './co-modality-list.component';

describe('CoModalityListComponent', () => {
  let component: CoModalityListComponent;
  let fixture: ComponentFixture<CoModalityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoModalityListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoModalityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
