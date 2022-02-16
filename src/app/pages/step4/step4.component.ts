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
	public studentList: IStudentInfo[] = []

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

	async ngOnInit(): Promise<void> {
		this.totalKeys = await this.dataStorageService.getTotalKeys()
		this.studentList = await this.dataStorageService.getStudentInfoList()
		this.asistenceList = this.studentList.filter(x => x.idBar != null)
		this.file = (await this.dataStorageService.restoreFileResponses()) as string
		if (this.file?.length) {
			this.dataAnswer = this.dataStorageService.clearFile(this.file)
			//this.file = this.file.replace(/\,\,/g, ', ,').replace(/\,\,/g, ', ,')
		}
	}
	fileProcess(){
		return this.file.replace(/\,\,/g, ', ,').replace(/\,\,/g, ', ,')
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
					this.dataStorageService.getTotalKeys().then(x => this.totalKeys = x)
					this.dataAnswer = this.dataStorageService.clearFile(reader.result as string)
					this.processCalification()
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
	normalizeString(str: string){
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '').trim().split(" ").filter(x => x.length > 3).join(" ").toUpperCase()

	}
	processCalification() {


		
		let careers = this.dataStorageService.getCareers()

		careers.forEach(x => {
			console.log(this.normalizeString(x.careerName));
			
			//console.log(x.careerName.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
			
		})
		

		let list = this.studentList.filter((x,i) => i < 120)
		console.log(list);
		
	}
	saveData(){
		this.processCalification()
		/*this.dataStorageService.setStudentAnswers(this.processAnswers())
		this.message.add({ severity: "success", detail: 'Datos guardados' })*/
	}
	validate(){
		this.router.navigate(['/report'])
		/*this.dataStorageService.getSudentAnswers().then(studentData => {
			if (studentData.length == 0) {
				this.message.add({ severity: "warn", detail: 'Primero salve las respuestas de los estudiantes' })
			}
			else this.router.navigate(['/report'])
		})*/
		
	}
}

interface ICalification{
	code: string,
	fullname: string,
	score: number,
	calification: string,
	dni: string
}