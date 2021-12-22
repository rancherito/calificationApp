import { Injectable } from '@angular/core';
import { IAnswer, IKeyAnswer, IExcelData, IStudentInfo } from "../providersInterfaces";

@Injectable({
	providedIn: 'root'
})
export class DatastorageService {
	//FILE DATA
	restoreFileStudentInfo() {
		return JSON.parse(localStorage.getItem('fileStudentInfo')??'[]') as Record<string, string>[]
	}
	saveFileStudentInfo(fileStudentInfo: string) {
		localStorage.setItem('fileStudentInfo', fileStudentInfo)
	}

	restoreFileKeyAnswer() {
		return localStorage.getItem('fileKeyAnswers')
	}
	saveFileKeyAnswer(fileKeyAnswer: string) {
		localStorage.setItem('fileKeyAnswers', fileKeyAnswer)
	}

	//GENERAL DATA
	getKeyAnswerList(): IKeyAnswer[] {
		return JSON.parse(localStorage.getItem('keyAnswersList') ?? '[]') as IKeyAnswer[]
	}
	setKeyAnswerList(keyAnswerList: IKeyAnswer[]) {
		localStorage.setItem('keyAnswersList', JSON.stringify(keyAnswerList))
	}
	
	getAnswerList(): IAnswer[] {
		return JSON.parse(localStorage.getItem('answersList') ?? '[]') as IAnswer[]
	}
	setAnswerList(answerList: IAnswer[]) {
		localStorage.setItem('answersList', JSON.stringify(answerList))
	}

	setStudentInfoList(studentInfo: IStudentInfo[])  {
		return localStorage.setItem('studentInfoList', JSON.stringify(studentInfo))
	}
	getStudentInfoList(): IStudentInfo[]{
		return JSON.parse(localStorage.getItem('studentInfoList')??'[]') as IStudentInfo[]
	}
	//UTILS
	getTotalKeys() {
		return parseInt(localStorage.getItem('totalKyes')??'0')
	}
	clearFile(fileString: string | null){
		return (fileString??"").split('\r\n').filter(e => e.length > 0)
	}

	setTotalKeys(total: number) {
		localStorage.setItem('totalKyes', total.toString())
	}

}
