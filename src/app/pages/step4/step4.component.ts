import { Component, OnInit } from '@angular/core';
import { IExcelData, IAnswer, IKeyAnswer, IData } from "../../providersInterfaces";

@Component({
	selector: 'page-step4',
	templateUrl: './step4.component.html',
	styleUrls: ['./step4.component.scss']
})
export class Step4Component implements OnInit {
	private totalQuestions: number = 0
	public dataAnswer: IAnswer[] = []
	public studentList: IExcelData[] = []
	public keyList: IKeyAnswer[] = []
	public dataCodeBarList: IData[] = []

	public processDataList: ICalification[] = []
	constructor() { }

	ngOnInit(): void {
		this.totalQuestions = parseInt(localStorage.getItem('totalQuestions')??'0')
		this.dataAnswer = JSON.parse(localStorage.getItem('dataAnswer')??'[]') as IAnswer[]
		this.studentList = JSON.parse(localStorage.getItem('studentDataOficial')??'[]') as IExcelData[]
		this.keyList = JSON.parse(localStorage.getItem('keysListOficial')??'[]') as IKeyAnswer[]
		this.dataCodeBarList = JSON.parse(localStorage.getItem('dataCodeBar')??'[]') as IData[]
		this.processDataList = JSON.parse(localStorage.getItem('processDataList') ?? '[]') as ICalification[]
	}
	process(){
		this.processDataList = this.computeScore()
		localStorage.setItem('processDataList', JSON.stringify(this.processDataList)) 
	}
	computeScore(){
		let student = this.studentList/*.filter((x, y) => y < 160)*/

		let data = student.map(x => {
			let relationCodeBar = this.dataCodeBarList.find(y => y.idStudent == x.code);
			let score = this.dataAnswer.filter(y => y.idBar == relationCodeBar?.idBar).reduce((acc, cur) => {
				let points = 0
				if (cur.answer == null) points = 0.5
				else points = this.keyList.find(z => z.idGroup == cur.idTheme && z.index == cur.idQuestion && z.key == cur.answer) == undefined ? 0 : 5
				return acc + points
			},0)
			let info: ICalification = {dni: x.dni??"", code: x.code??"", fullname: x.fullname??"", score, calification: ((score / 300) * 20).toFixed(2) }
			return info
		})

		return data.sort((x, y) => parseFloat(y.calification) - parseFloat(x.calification))
	}
	loadData(e: Event){

		let target = e.target as HTMLInputElement;
		let files = target.files ?? []
		if (files.length > 0) {
			let file = files[0]
			let reader = new FileReader()
			reader.onload = () => {
				let data = reader.result?.toString().split("\r\n").filter(x => x.length > 0) ?? []
				let dataAswer: IAnswer[] = []
				for (let ind = 1; ind < data.length; ind++) {
					let rowData = data[ind].split(",");
					let [idBar, idTheme] = [rowData[0], rowData[1]]
					for (let e = 2; e < this.totalQuestions + 2; e++) {
						dataAswer.push({ idBar, idTheme, idQuestion: e - 1, answer: rowData[e] == '' ? null : rowData[e] })
					}

				}
				this.dataAnswer = dataAswer
				localStorage.setItem('dataAnswer', JSON.stringify(dataAswer))
			}
			reader.readAsText(file)
		}
	}
}

interface ICalification{
	code: string,
	fullname: string,
	score: number,
	calification: string,
	dni: string
}