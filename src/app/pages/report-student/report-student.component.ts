import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartDataset } from 'chart.js';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { IAnswer, IStudentInfo } from 'src/app/providersInterfaces';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
	selector: 'page-report-student',
	templateUrl: './report-student.component.html',
	styleUrls: ['./report-student.component.scss']
})
export class ReportStudentComponent implements OnInit {

	public studentInfo?: IStudentInfo;
	public answers: IAnswer[] = [];
	public studentCode: string | null = null;
	public answerStudent: IAnswerStudent[] = [];
	public data: ChartData | null = null;
	public statusInfo: Record<string, string> = {
		'N': 'INCORRECTA',
		'B': 'EN BLANCO',
		'C': 'CORRECTA'
	}
	public statusInfoColor: Record<string, string> = {
		'N': '#dc334d',
		'B': 'GRAY',
		'C': '#23ba73'
	}
	public dataset: Record<string, number> = {};
	public dataset2: InfoChart[] = []

	constructor(
		private store: DatastorageService,
		private activateRoute: ActivatedRoute
	) { }

	total(){
		let score: { score: number, totalQuestions: number, calification: string} = {score: 0, totalQuestions: 0, calification: '0.00'};
		this.dataset2.forEach(e => {
			score.score += e.status == 'C' ? e.total * 5 : (e.status == 'N' ? 0 : e.total * .5);
			score.totalQuestions += e.total
		})
		score.calification = ((score.score / (score.totalQuestions * 5)) * 20).toFixed(2);
		return score;
	}
	score(){
		return this.answerStudent.reduce((ac, e) => ac + e.points, 0)
	}
	ngOnInit() {
		this.activateRoute.params.subscribe(async (p) => {
			this.studentCode = p.student as string;

			if (this.studentCode != null) {
				const students = await this.store.getStudentInfoList();
				
				this.studentInfo = students.find(e => e.code == this.studentCode);
				console.log(this.studentInfo);


				if (this.studentInfo != undefined) {
					
					let infoResponseStudent: [] = []
					const keyAnswers = (await this.store.getKeyAnswerList()).filter(e => e.idGroup == this.studentInfo?.group);
					const countKeys = await this.store.getAverageKeys()
					this.answers = UtilsService.processAnswers(
						countKeys,
						UtilsService.clearFile((await this.store.restoreFileResponses()) as string),
						this.studentInfo.idBar
					)
					this.answers.forEach(e => {
						let key = keyAnswers.find(f => f.index == e.idQuestion)
						if (key) {
							let response: IAnswerStudent = {
								index: e.idQuestion,
								answer: e.answer,
								correct: key.key,
								points: 0,
								status: 'N'
							}
							if (e.answer == null) {
								response['status'] = 'B'
								response['points'] = 0.5
							}
							else if(e.answer == key.key){
								response['status'] = 'C'
								response['points'] = 5
							}
							this.answerStudent.push(response);
						}
					})
					this.dataset = {} as Record<string, number>
					this.answerStudent.forEach(e => {
						let index = this.dataset2.findIndex(f => f.status == e.status)
						if (index == -1) {
							this.dataset2.push({
								status: e.status,
								total: 1,
								statusName: this.statusInfo[e.status],
								color: this.statusInfoColor[e.status],
								percent: '0.00'
							})
						}
						else this.dataset2[index].total += 1

						if (this.dataset[e.status] == undefined) {
							this.dataset[e.status] = 0
						}
						this.dataset[e.status] += 1
					})

					this.dataset2.forEach(e => {
						e.percent = ((e.total / this.answerStudent.length) * 100).toFixed(2)
					})

					let chartTotalStudentsDataset: ChartDataset[] = [
						{
							label: 'Total estudiantes por carrera',
							backgroundColor: Object.keys(this.dataset).map(e => this.statusInfoColor[e]),
							data: Object.values(this.dataset),
						}
					]

					console.log(this.dataset);
					

					this.data = {
						labels: Object.keys(this.dataset).map(e => this.statusInfo[e]),
						datasets: chartTotalStudentsDataset
					}
				}

			}
		})


	}
	/*this.students =  await this.store.getStudentInfoList()
	this.keys = await this.store.getAverageKeys()
	this.answers = UtilsService.processAnswers(this.keys, UtilsService.clearFile((await this.store.restoreFileResponses()) as string))

	console.log(this.answers);*/

}


interface IAnswerStudent {
	index: number
	answer: string | null
	correct: string
	status: string
	points: number
}
interface InfoChart{
	status: string
	statusName: string
	total: number
	color: string
	percent: string
}