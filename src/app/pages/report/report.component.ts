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
	public studentInfoList: IStudentInfo[] = [];
	public studentDataList: IStudentInfo[] = [];

	public data: ChartData | null = null;


	constructor(
		private storage: DatastorageService
	) {
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
		this.careerInfoList.forEach(x => {
			let studentDataList = this.filterResultsPerCareer(x.career);
			list.push(...studentDataList)
		})
		const sheet = xlsx.utils.json_to_sheet(list);
		xlsx.utils.book_append_sheet(book, sheet, 'LISTA DE ESTUDIANTES');
		xlsx.writeFile(book, 'REPORT_ALL.xlsx');
	}

	loadChartData() {

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
	async ngOnInit(): Promise<void> {



		this.studentInfoList = await this.storage.getStudentInfoList()//.filter(x => x.idBar != null);

		this.careerInfoList = this.studentInfoList.reduce((ac, i) => {
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
		}, [] as ICareer[]).sort((a, b) => (b.careerName ?? '') < (a.careerName ?? '') ? 1 : -1);

		this.loadChartData()

	}
	selectChange() {
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

