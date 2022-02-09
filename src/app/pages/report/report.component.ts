import { Component, OnInit } from '@angular/core';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { IAnswer, IKeyAnswer, IStudentInfo } from 'src/app/providersInterfaces';
import * as xlsx from 'xlsx';

@Component({
	selector: 'page-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
	public careerInfoList: ICareer[] = []
	public careerSelected: ICareer | null = null
	public studentAnswerList: IAnswer[] = []
	public stidentInfoList: IStudentInfo[] = [];
	public answerList: IKeyAnswer[] = [];
	public studentDataList: IStudentInfo[] = [];

	constructor(
		private storage: DatastorageService
	) { 
		
	}

	ngOnInit(): void {
		
		this.stidentInfoList = this.storage.getStudentInfoList().filter(x => x.idBar != null);
		this.careerInfoList = this.stidentInfoList.reduce((ac, i) => {
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
		this.answerList = this.storage.getKeyAnswerList();
		
	}
	selectChange(){
		
		let filterStundentCareerList = this.stidentInfoList.filter(x => x.career == this.careerSelected?.career)//.filter((x, i) => i < 6);

		filterStundentCareerList.forEach(x => {
			let filterGroup = this.answerList.filter(e => e.idGroup == x.group);
			let studentAnswer = this.studentAnswerList.filter(y => y.idBar == x.idBar);
			if (studentAnswer.length > 0 && filterGroup.length > 0) {


				let score = studentAnswer.reduce((ac, i) => {
					let find = filterGroup.find(e => e.index == i.idQuestion);
					if (find != undefined) {
						if(i.answer == null) return ac + .5;
						else if(i.answer == find.key) return ac + 5;
					}
					return ac;
				},0)
				x.score = score;
				x.calification = parseFloat(((score / (filterGroup.length * 5)) * 20).toFixed(2));
			}
		})
		this.studentDataList = filterStundentCareerList;
		/*const book = xlsx.utils.book_new();
		const sheet = xlsx.utils.json_to_sheet(this.studentDataList);
		xlsx.utils.book_append_sheet(book, sheet, 'Sheet1');
		xlsx.writeFile(book, 'report.xlsx');*/
	}

}

interface ICareer{
	career: string | null
	careerName: string | null
	totalStundets: number 
}