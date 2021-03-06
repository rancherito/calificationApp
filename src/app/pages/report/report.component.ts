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
	public careerStudentsInfo: ICareer[] = []

	public careerSelected: ICareer | null = null
	public studentAnswerList: IAnswer[] = []
	public studentInfoList: IStudentInfo[] = [];
	public studentDataList: IStudentInfo[] = [];
	public totalStudents: number = 0;
	public data: ChartData | null = null;
	public average: number = 0;
	public searchStudent: string = '';
	public searchStudentList: IStudentInfo[] = []


	constructor(
		private storage: DatastorageService
	) {
	}

	initSearch() {
		if (this.searchStudent.length >= 3) {
			this.searchStudentList = this.studentInfoList
			.filter(x => 
				(x.fullname??'').toLowerCase().includes(this.searchStudent.toLowerCase()) || 
				(x.code + '').toLowerCase().includes(this.searchStudent.toLowerCase())
			)
			.filter((x ,i) => i < 10)
		}
		else
			this.searchStudentList = []
	}
	resaltText(text: string | null, find: string) {
		return (text + '').toUpperCase().replace(find.toUpperCase(), '<span class="resalt-text">' + find.toUpperCase() + '</span>');
	}
	percentCalcule(num: number, total: number) {
		return ((num * 100) / total) + '%';
	}
	selectCareer(career: ICareer) {
		this.careerSelected = career;
		this.studentDataList = this.filterResultsPerCareer(career.career);
	}
	prepareExcelPerCareer(career: ICareer) {
		let studentDataList = this.filterResultsPerCareer(career.career);
		this.generateExcelFileBase(studentDataList, career);
	}
	generateExcelFile() {
		if (this.careerSelected != null) this.generateExcelFileBase(this.studentDataList, this.careerSelected);
	}
	generateExcelFileBase(studentList: IStudentInfo[], career: ICareer) {
		const book = xlsx.utils.book_new();
		const sheet = xlsx.utils.json_to_sheet(studentList);
		xlsx.utils.book_append_sheet(book, sheet, 'Sheet1');
		xlsx.writeFile(book, career?.career + '_REPORT.xlsx');
	}
	generateExcelFileAll() {

		const book = xlsx.utils.book_new();
		let list: IStudentInfo[] = []
		this.careerStudentsInfo.forEach(x => {
			let studentDataList = this.filterResultsPerCareer(x.career);
			list.push(...studentDataList)
		})
		const sheet = xlsx.utils.json_to_sheet(list);
		xlsx.utils.book_append_sheet(book, sheet, 'LISTA DE ESTUDIANTES');
		xlsx.writeFile(book, 'REPORT_ALL.xlsx');
	}

	loadChartData() {
		this.storage.getCareers().subscribe(x => {
			let chartTotalStudentsLabel: string[] = []
			let chartTotalStudentsDataset: ChartDataset[] = [
				{
					label: 'Total estudiantes por carrera',
					backgroundColor: [],
					data: [],
				}
			]
			let prepareColor: string[] = []
			this.careerStudentsInfo.forEach(x => {

				chartTotalStudentsLabel.push(x.career ?? '');
				chartTotalStudentsDataset[0].data.push(x.totalStundents);
				prepareColor.push(this.storage.getColorPerCarrer(x.career))
				
			})
			chartTotalStudentsDataset[0].backgroundColor = prepareColor
			//console.log(prepareColor);
			
			this.data = {
				labels: chartTotalStudentsLabel,
				datasets: chartTotalStudentsDataset
			}
		})
	}
	async ngOnInit(): Promise<void> {

		this.studentInfoList = await this.storage.getStudentInfoList()//.filter(x => x.idBar != null);
		this.average = await this.storage.getAverageKeys();
		this.careerStudentsInfo = this.studentInfoList.reduce((ac, i) => {
			let index = ac.findIndex(x => x.career == i.career);
			if (index > -1) {
				ac[index].totalStundents++;
				ac[index].asistence += (i.idBar != null ? 1 : 0)

			}
			else ac.push({
				career: i.career,
				totalStundents: 1,
				careerName: i.careerName,
				asistence: i.idBar != null ? 1 : 0
			});
			return ac;
		}, [] as ICareer[]).sort((a, b) => (b.careerName ?? '') < (a.careerName ?? '') ? 1 : -1);

		this.totalStudents = this.studentInfoList.length;
		this.loadChartData()

	}
	selectChange() {
		console.log(this.careerSelected);
		
		if (this.careerSelected?.career) {
			this.studentDataList = this.filterResultsPerCareer(this.careerSelected?.career);
		}
	}
	filterResultsPerCareer(career: string | null) {
		let modality: Record<string, IStudentInfo[]> = {}
		let list: IStudentInfo[] = []
		this.studentInfoList.filter(x => x.career == career).forEach(x => {
			if (modality[x.modality ?? 'SIN MODALIDAD'] == null) modality[x.modality ?? 'SIN MODALIDAD'] = []
			modality[x.modality ?? 'SIN MODALIDAD'].push(x);
		})
		for (const iterator in modality) {

			let filterStundentCareerList = modality[iterator].filter(x => x.career == career).sort((a, b) => b.score - a.score)
			filterStundentCareerList.forEach((x, i) => {
				x.merith = filterStundentCareerList.findIndex(y => y.score == x.score) + 1
				x.n = i + 1
			})
			list.push(...filterStundentCareerList)
		}
		return list;
	}

}

