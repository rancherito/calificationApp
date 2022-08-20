import { Injectable } from '@angular/core';
import { IAnswer } from '../providersInterfaces';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	constructor() { }

	static processAnswers(totalKeys: number, dataAnswer: string[], idBarEspecific: string | null = null): IAnswer[] {
		let keyList: IAnswer[] = []
		for (let index = 1; index < dataAnswer.length; index++) {
			let rowAnswer = dataAnswer[index].split(",")
			let [idBar, idTheme] = [rowAnswer[0], rowAnswer[1]]

			for (let e = 2; e < totalKeys + 2; e++) {
				if (idBarEspecific == null || idBarEspecific == idBar) 
					keyList.push({ idBar, idTheme: idTheme == '' ? 'NULL' : idTheme, idQuestion: e - 1, answer: rowAnswer[e] == '' ? null : rowAnswer[e] })	
			}

		}
		return keyList
	}
	static clearFile(fileString: string | null) {
		return (fileString ?? "").split('\r\n').map(x => x.replace(/ +(?= )/g, '')).filter(e => e.length > 1)
	}
}
