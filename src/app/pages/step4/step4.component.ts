import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { IExcelData, IAnswer, IKeyAnswer, IRelationCodeBar, IStudentInfo, ICalification } from "../../providersInterfaces";

@Component({
	selector: 'page-step4',
	templateUrl: './step4.component.html',
	styleUrls: ['./step4.component.scss'],
	providers: [MessageService]
})
export class Step4Component implements OnInit {
	private totalQuestions: number = 0
	public dataAnswer: string[] = []
	public asistenceList: IStudentInfo[] = []
	public studentList: IStudentInfo[] = []

	/*public dataCodeBarList: IRelationCodeBar[] = []*/
	public totalKeys = 0
	public JSON = JSON
	public file: string = ""
	public processDataList: ICalification[] = []
	public answerList: IKeyAnswer[] = [];
	public processAnswers: IAnswer[] = [];
	constructor(
		private dataStorageService: DatastorageService,
		private router: Router,
		private message: MessageService,
		private utils: UtilsService
	) { }

	async ngOnInit(): Promise<void> {
		this.answerList = await this.dataStorageService.getKeyAnswerList();
		this.totalKeys = await this.dataStorageService.getAverageKeys()
		this.studentList = await this.dataStorageService.getStudentInfoList()
		this.asistenceList = this.studentList.filter(x => x.idBar != null)
		this.file = (await this.dataStorageService.restoreFileResponses()) as string
		if (this.file?.length) {
			this.dataAnswer = UtilsService.clearFile(this.file)
			this.processAnswers = UtilsService.processAnswers(this.totalKeys, this.dataAnswer);
		}
	}
	fileProcess() {
		return this.file.replace(/\,\,/g, ', ,').replace(/\,\,/g, ', ,')
	}

	listCountThemesAnswer() {
		let themes: { idTheme: string, total: number }[] = []
		UtilsService.processAnswers(this.totalKeys, this.dataAnswer).forEach(x => {
			let i = themes.findIndex(y => y.idTheme == x.idTheme)
			if (i == -1) themes.push({ idTheme: x.idTheme, total: 1 })
			else themes[i].total++
		})
		themes.map(x => x.total = x.total / this.totalKeys)
		return themes
	}
	totalStudents() {
		return this.listCountThemesAnswer().reduce((acc, cur) => acc + cur.total, 0)
	}
	loadData(e: Event) {

		let target = e.target as HTMLInputElement;
		let files = target.files ?? []
		if (files.length > 0) {
			let file = files[0]
			let reader = new FileReader()
			reader.onload = () => {
				console.log(reader.result);
				if (reader.result) {
					this.file = reader.result as string
					this.dataStorageService.saveFileResponses(reader.result as string)
					this.dataStorageService.getAverageKeys().then(x => this.totalKeys = x)
					this.dataAnswer = UtilsService.clearFile(reader.result as string)
					this.processCalification()
				}

			}
			reader.readAsText(file)
		}
	}

	processCalification() {

		let list = this.studentList
		this.processAnswers = UtilsService.processAnswers(this.totalKeys, this.dataAnswer);

		list.forEach(student => {
			student.score = 0;
			student.calification = 0;
			student._b = 0
			student._c = 0
			student._n = 0

			if (student.idBar == null) {
				student._b = 60
			}
			else {

				let filterGroup = this.answerList.filter(e => e.idGroup == student.group);
				let studentAnswer = this.processAnswers.filter(x => x.idBar == student.idBar)

				if (studentAnswer.length > 0 && filterGroup.length > 0) {


					let score = studentAnswer.reduce((ac, i) => {

						let find = filterGroup.find(e => e.index == i.idQuestion);
						if (find != undefined) {
							if (i.answer == null) {
								ac += .5;
								student._b = (student._b ?? 0) + 1
							}
							else if (i.answer == find.key) {
								
								ac += 5;
								student._c = (student._c ?? 0) + 1
							}
							else student._n = (student._n ?? 0) + 1
						}
						return ac;
					}, 0)
					student.score = score;
					student.calification = parseFloat(((score / (filterGroup.length * 5)) * 20).toFixed(2));
				}
			}
		})
		let promise = this.dataStorageService.setStudentInfoList(list)
		if (promise != null) {
			promise.then(() => {
				this.message.add({ severity: 'success', summary: 'Guardado', detail: 'Datos guardados correctamente' })
			})
		}


	}
	saveData() {
		this.processCalification()
	}
	validate() {
		this.dataStorageService.getStudentInfoList().then(x => {
			let everyNull = x.every(e => e.calification == null)
			let everyZero = x.every(e => e.calification == 0)


			if (everyZero || everyNull) this.message.add({ detail: 'Guarde antes las notas', severity: 'warn' })
			else this.router.navigate(['/report'])

		})

	}
}

