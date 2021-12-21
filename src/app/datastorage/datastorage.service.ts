import { Injectable } from '@angular/core';
import { IAnswer, IKeyAnswer } from "../providersInterfaces";

@Injectable({
	providedIn: 'root'
})
export class DatastorageService {
	private keyAnswersList: IKeyAnswer[] = []
	private answersList: IAnswer[] = []
	private fileKeyAnswer: string | null = null

	getKeyAnswerList(): IKeyAnswer[] {
		if (this.keyAnswersList.length) this.keyAnswersList = JSON.parse(localStorage.getItem('keyAnswersList') ?? '[]') as IKeyAnswer[]
		return this.keyAnswersList
	}
	setKeyAnswerList(keyAnswerList: IKeyAnswer[]) {
		this.keyAnswersList = keyAnswerList
		localStorage.setItem('keyAnswersList', JSON.stringify(this.keyAnswersList))
	}
	getAnswerList(): IAnswer[] {
		if (this.answersList.length) this.answersList = JSON.parse(localStorage.getItem('answersList') ?? '[]') as IAnswer[]
		return this.answersList
	}
	setAnswerList(answerList: IAnswer[]) {
		this.answersList = answerList
		localStorage.setItem('answersList', JSON.stringify(this.answersList))
	}

	restoreFileKeyAnswer() {
		this.fileKeyAnswer = localStorage.getItem('fileKeyAnswers')
		return this.fileKeyAnswer
	}
	saveFileKeyAnswer(fileKeyAnswer: string) {
		this.fileKeyAnswer = fileKeyAnswer
		localStorage.setItem('fileKeyAnswers', fileKeyAnswer)
	}

	clearFile(fileString: string | null){
		return (fileString??"").split('\r\n').filter(e => e.length > 0)
	}
	
}
