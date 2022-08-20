import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVacanciesComponent } from './report-vacancies.component';

describe('ReportVacanciesComponent', () => {
  let component: ReportVacanciesComponent;
  let fixture: ComponentFixture<ReportVacanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportVacanciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
