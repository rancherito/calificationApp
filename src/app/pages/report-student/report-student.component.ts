import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
	public statusInfo: Record<string, string> = {
		'N': 'INCORRECTA',
		'B': 'EN BLANCO',
		'C': 'CORRECTA'
	}
	public statusInfoColor: Record<string, string> = {
		'N': '#e91e63',
		'B': '#a55f03',
		'C': '#0d7011'
	}
	constructor(
		private store: DatastorageService,
		private activateRoute: ActivatedRoute
	) { }

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