import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { IExcelData, IAnswer, IKeyAnswer, IRelationCodeBar, IStudentInfo } from "../../providersInterfaces";

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
	/*public dataCodeBarList: IRelationCodeBar[] = []*/
	public totalKeys = 0
	public JSON = JSON
	public file: string = ""
	public processDataList: ICalification[] = []
	constructor(
		private dataStorageService: DatastorageService,
		private router: Router,
		private message: MessageService
	) { }

	ngOnInit(): void {
		/*this.totalQuestions = parseInt(localStorage.getItem('totalQuestions')??'0')
		this.dataAnswer = JSON.parse(localStorage.getItem('dataAnswer')??'[]') as IAnswer[]
		this.studentList = JSON.parse(localStorage.getItem('studentDataOficial')??'[]') as IExcelData[]
		this.keyList = JSON.parse(localStorage.getItem('keysListOficial')??'[]') as IKeyAnswer[]
		this.dataCodeBarList = JSON.parse(localStorage.getItem('dataCodeBar')??'[]') as IRelationCodeBar[]
		this.processDataList = JSON.parse(localStorage.getItem('processDataList') ?? '[]') as ICalification[]*/
		this.totalKeys = this.dataStorageService.getTotalKeys()
		
		this.asistenceList = this.dataStorageService.getStudentInfoList().filter(x => x.idBar != null)
		this.file = this.dataStorageService.restoreFileResponses() as string
		if (this.file?.length) {
			this.dataAnswer = this.dataStorageService.clearFile(this.file)
			this.file = this.file.replace(/\,\,/g, ', ,').replace(/\,\,/g, ', ,')
		}
	}
	processAnswers(): IAnswer[] {
		let keyList: IAnswer[] = []
		for (let index = 1; index < this.dataAnswer.length; index++) {
			let rowAnswer = this.dataAnswer[index].split(",")
			let [idBar, idTheme] = [rowAnswer[0], rowAnswer[1]]
			for (let e = 2; e < this.totalKeys + 2; e++) {
				keyList.push({ idBar, idTheme: idTheme == '' ? 'NULL': idTheme, idQuestion: e - 1, answer: rowAnswer[e] == '' ? null : rowAnswer[e] })
			}
		}
		return keyList
	}
	listCountThemesAnswer(){
		let themes: { idTheme: string, total: number }[] = []
		this.processAnswers().forEach(x => {
			let i = themes.findIndex(y => y.idTheme == x.idTheme)
			if ( i == -1) themes.push({ idTheme: x.idTheme, total: 1 })
			else themes[i].total++
		})
		themes.map(x => x.total = x.total / this.totalKeys)
		return themes
	}
	totalStudents(){
		return this.listCountThemesAnswer().reduce((acc, cur) => acc + cur.total, 0)
	}
	computeResponses(){

		/*let student = this.studentList/*.filter((x, y) => y < 160)

		let data = student.map(x => {
			let relationCodeBar = this.dataCodeBarList.find(y => y.code == x.code);
			let score = this.dataAnswer.filter(y => y.idBar == relationCodeBar?.idBar).reduce((acc, cur) => {
				let points = 0
				if (cur.answer == null) points = 0.5
				else points = this.keyList.find(z => z.idGroup == cur.idTheme && z.index == cur.idQuestion && z.key == cur.answer) == undefined ? 0 : 5
				return acc + points
			},0)
			let info: ICalification = {dni: x.dni??"", code: x.code??"", fullname: x.fullname??"", score, calification: ((score / 300) * 20).toFixed(2) }
			return info
		})

		return data.sort((x, y) => parseFloat(y.calification) - parseFloat(x.calification))*/
	}
	loadData(e: Event){

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
					this.totalKeys = this.dataStorageService.getTotalKeys()
					this.dataAnswer = this.dataStorageService.clearFile(reader.result as string)
					
				}
				
				/*let data = reader.result?.toString().split("\r\n").filter(x => x.length > 0) ?? []
				let dataAswer: IAnswer[] = []
				for (let ind = 1; ind < data.length; ind++) {
					let rowData = data[ind].split(",");
					let [idBar, idTheme] = [rowData[0], rowData[1]]
					for (let e = 2; e < this.totalQuestions + 2; e++) {
						dataAswer.push({ idBar, idTheme, idQuestion: e - 1, answer: rowData[e] == '' ? null : rowData[e] })
					}

				}
				this.dataAnswer = dataAswer*/
			}
			reader.readAsText(file)
		}
	}
	saveData(){
		this.dataStorageService.setStudentAnswers(this.processAnswers())
		this.message.add({ severity: "success", detail: 'Datos guardados' })
	}
	validate(){
		let studentData = this.dataStorageService.getSudentAnswers()
		console.log(studentData);
		
		if (studentData.length == 0) {
			this.message.add({ severity: "warn", detail: 'Primero salve las respuestas de los estudiantes' })
		}
		else this.router.navigate(['/report'])
	}
}

interface ICalification{
	code: string,
	fullname: string,
	score: number,
	calification: string,
	dni: string
}