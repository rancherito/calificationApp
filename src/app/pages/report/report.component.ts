import { Component, OnInit } from '@angular/core';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { IAnswer, IKeyAnswer, IStudentInfo, ICareer } from 'src/app/providersInterfaces';
import * as xlsx from 'xlsx';
import { ChartData, ChartDataset } from 'chart.js';
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

	public data: ChartData | null= null;
	

	constructor(
		private storage: DatastorageService
	) { 
	}

	selectCareer(career: ICareer){
		this.careerSelected = career;
		this.studentDataList = this.filterResultsPerCareer(career.career);
	}
	prepareExcelPerCareer(career: ICareer){
		let studentDataList = this.filterResultsPerCareer(career.career);
		this.generateExcelFileBase(studentDataList, career);
	}
	generateExcelFile(){
		if (this.careerSelected != null) this.generateExcelFileBase(this.studentDataList, this.careerSelected);
	}
	generateExcelFileBase(studentList: IStudentInfo[], career: ICareer){
		const book = xlsx.utils.book_new();
		const sheet = xlsx.utils.json_to_sheet(studentList);
		xlsx.utils.book_append_sheet(book, sheet, 'Sheet1');
		xlsx.writeFile(book, career?.career + '_REPORT.xlsx');
	}
	generateExcelFileAll(){
		
		const book = xlsx.utils.book_new();
		this.careerInfoList.forEach(x => {
			let studentDataList = this.filterResultsPerCareer(x.career);
			const sheet = xlsx.utils.json_to_sheet(studentDataList);
			xlsx.utils.book_append_sheet(book, sheet, x.career + '');
		})
		xlsx.writeFile(book, 'REPORT_ALL.xlsx');
	}
	randomColor(){
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	loadChartData(){

		let chartTotalStudentsLabel: string[] = []
		let chartTotalStudentsDataset: ChartDataset[] = [
			{
				label: 'Total estudiantes por carrera',
				backgroundColor: [],
				data: [],
			}
		]
		this.careerInfoList.forEach(x => {
			
			chartTotalStudentsLabel.push(x.career ?? '');
			chartTotalStudentsDataset[0].data.push(x.totalStundets);
		})
		chartTotalStudentsDataset[0].backgroundColor = this.storage.getColors()

		this.data = {
			labels: chartTotalStudentsLabel,
			datasets: chartTotalStudentsDataset
		}
	
	}
	ngOnInit(): void {

		
		
		this.stidentInfoList = this.storage.getStudentInfoList()//.filter(x => x.idBar != null);
		
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
		}, [] as ICareer[]).sort((a, b) => (b.careerName??'') < (a.careerName??'') ? 1 : -1);

		this.studentAnswerList = this.storage.getSudentAnswers()
		this.answerList = this.storage.getKeyAnswerList();
		
		this.loadChartData()
		
	}
	selectChange(){
		if (this.careerSelected?.career) {
			this.studentDataList = this.filterResultsPerCareer(this.careerSelected?.career);
		}
	}
	filterResultsPerCareer(career: string | null){
		let filterStundentCareerList = this.stidentInfoList.filter(x => x.career == career)//.filter((x, i) => i < 6);

		filterStundentCareerList.forEach(x => {
			if (x.idBar == null) {
				x.score = 0;
				x.calification = 0
			}
			else{
				let filterGroup = this.answerList.filter(e => e.idGroup == x.group);
				let studentAnswer = this.studentAnswerList.filter(y => y.idBar == x.idBar);
				if (studentAnswer.length > 0 && filterGroup.length > 0) {


					let score = studentAnswer.reduce((ac, i) => {
						let find = filterGroup.find(e => e.index == i.idQuestion);
						if (find != undefined) {
							if (i.answer == null) return ac + .5;
							else if (i.answer == find.key) return ac + 5;
						}
						return ac;
					}, 0)
					x.score = score;
					x.calification = parseFloat(((score / (filterGroup.length * 5)) * 20).toFixed(2));
				}
			}
			
		})
		return filterStundentCareerList.sort((a, b) => (b.score??0) - (a.score??0))
	}

}

