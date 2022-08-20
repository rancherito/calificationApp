import { Component, OnInit } from '@angular/core';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { ICarrerModality } from 'src/app/providersInterfaces';

@Component({
	selector: 'page-report-vacancies',
	templateUrl: './report-vacancies.component.html',
	styleUrls: ['./report-vacancies.component.scss']
})
export class ReportVacanciesComponent implements OnInit {
	public vacancies: ICarrerModality[] = []
	constructor(
		private datastorageService: DatastorageService
	) {

	}
	salvar(){
		var saveaa: ICarrerModality[] = []
		this.vacancies.forEach(v => {
			if (typeof(v.vacancies) == 'string'){
				v.vacancies = parseInt(v.vacancies)
			}
			saveaa.push(v)

		})
		console.log(saveaa);
		
	}
	ngOnInit(): void {
		this.datastorageService.getCarrerModality().then(data => {
			this.vacancies = data.sort((a, b) => {
				if (a.career < b.career) {
					return -1;
				}
				if (a.career > b.career) {
					return 1;
				}
				return 0;
			})
		})
	}

}
