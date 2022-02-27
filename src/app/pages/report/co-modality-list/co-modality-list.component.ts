import { Component, OnInit } from '@angular/core';
import { ChartData, ChartDataset } from 'chart.js';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { ICareer, IStudentInfo } from 'src/app/providersInterfaces';
@Component({
	selector: 'co-modality-list',
	templateUrl: './co-modality-list.component.html',
	styleUrls: ['./co-modality-list.component.scss']
})
export class CoModalityListComponent implements OnInit {

	public careerModalityList: ICareerModality[] = []
	public studentInfoList: IStudentInfo[] = []
	public modalitys: string[] = []
	public charts: IModalityChart[] = [];
	constructor(
		private storage: DatastorageService
	) { }

	async ngOnInit(): Promise<void> {
		this.studentInfoList = await this.storage.getStudentInfoList()
		this.studentInfoList.forEach(x => {
			if (this.modalitys.find(e => e == x.modality) == undefined) this.modalitys.push(x.modality ?? '');
		})

		this.modalitys.forEach(mod => {
			let cm = this.studentInfoList.reduce((ac, i) => {
				if (i.modality == mod) {
					let index = ac.findIndex(x => x.career == i.career);
					if (index > -1) {
						ac[index].totalStundents++;
						ac[index].asistence += i.idBar != null ? 1 : 0
					}
					else ac.push({
						career: i.career,
						totalStundents: 1,
						careerName: i.careerName,
						asistence: i.idBar != null ? 1 : 0
					});
				}
				return ac;
			}, [] as ICareer[]).sort((a, b) => (b.careerName ?? '') < (a.careerName ?? '') ? 1 : -1);

			this.careerModalityList.push({
				modality: mod,
				careers: cm
			})
		})

		this.storage.getCareers().subscribe(ca => {
			this.careerModalityList.forEach(mod => {
				let chartTotalStudentsLabel: string[] = []
				let chartTotalStudentsDataset: ChartDataset[] = [
					{
						label: 'Por la modalidad de ' + mod.modality,
						backgroundColor: [],
						data: [],
					}
				]
				let colorCareer: string[] = []
				mod.careers.forEach(x => {

					chartTotalStudentsLabel.push(x.career ?? '');
					chartTotalStudentsDataset[0].data.push(x.totalStundents);
					colorCareer.push(this.storage.getColorPerCarrer(x.career))
				})
				chartTotalStudentsDataset[0].backgroundColor = colorCareer

				this.charts.push({
					label: mod.modality,
					totalStudents: mod.careers.reduce((ac, i) => ac + i.totalStundents, 0),
					data: {
						labels: chartTotalStudentsLabel,
						datasets: chartTotalStudentsDataset
					}
				})
			})
		})

		
	}

}

interface ICareerModality {
	modality: string
	careers: ICareer[]
}
interface IModalityChart {
	label: string ;
	totalStudents: number
	data: ChartData;
}