import { Component, OnInit } from '@angular/core';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { IAnswer } from 'src/app/providersInterfaces';

@Component({
	selector: 'page-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
	public careerInfoList: ICareer[] = []
	public careerSelected: ICareer | null = null
	public studentAnswerList: IAnswer[] = []
	constructor(
		private storage: DatastorageService
	) { }

	ngOnInit(): void {
		
		let stidentInfo = this.storage.getStudentInfoList().filter(x => x.idBar != null);
		this.careerInfoList = stidentInfo.reduce((ac, i) => {
			let index = ac.findIndex(x => x.career == i.career);
			if (index > -1) {
				ac[index].totalStundets++;
			}
			else ac.push({
				career: i.career,
				totalStundets: 1,
				careerName: i.careerName,
			});
			return ac;
		}, [] as ICareer[])
		this.studentAnswerList = this.storage.getSudentAnswers()
		
	}
	selectChange(){
		console.log('data change');
		console.log(this.careerSelected);
		
	}

}

interface ICareer{
	career: string | null
	careerName: string | null
	totalStundets: number 
}