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

	ngOnInit(): void {
		this.studentInfoList = this.storage.getStudentInfoList()
		this.studentInfoList.forEach(x => {
			if (this.modalitys.find(e => e == x.modality) == undefined) this.modalitys.push(x.modality ?? '');
		})

		this.modalitys.forEach(mod => {
			let cm = this.studentInfoList.reduce((ac, i) => {
				if (i.modality == mod) {
					let index = ac.findIndex(x => x.career == i.career);
					if (index > -1) {
						ac[index].totalStundets++;
					}
					else ac.push({
						career: i.career,
						totalStundets: 1,
						careerName: i.careerName,
					});
				}
				return ac;
			}, [] as ICareer[]).sort((a, b) => (b.careerName ?? '') < (a.careerName ?? '') ? 1 : -1);
			this.careerModalityList.push({
				modality: mod,
				careers: cm
			})
		})


		this.careerModalityList.forEach(mod => {
			let chartTotalStudentsLabel: string[] = []
			let chartTotalStudentsDataset: ChartDataset[] = [
				{
					label: 'Por la modalidad de ' + mod.modality,
					backgroundColor: [],
					data: [],
				}
			]
			mod.careers.forEach(x => {

				chartTotalStudentsLabel.push(x.career ?? '');
				chartTotalStudentsDataset[0].data.push(x.totalStundets);
			})
			chartTotalStudentsDataset[0].backgroundColor = this.storage.getColors()

			this.charts.push({
				label: mod.modality,
				data: {
					labels: chartTotalStudentsLabel,
					datasets: chartTotalStudentsDataset
				}
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
	data: ChartData;
}