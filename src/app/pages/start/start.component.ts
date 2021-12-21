import { Component, OnInit } from '@angular/core';
import { IKeyAnswer} from '../../providersInterfaces';
import { DatastorageService } from "../../datastorage/datastorage.service";
@Component({
	selector: 'page-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
	
})
export class StartComponent implements OnInit {
	public claves: string[] = []
	public isDeleteCabecera = true;
	
	constructor(private datastorageService: DatastorageService) { }

	computeKeys(): IKeyAnswer[]{
		let tableKeys: IKeyAnswer[] = []
		let keys = [...this.claves].map(e => e.split(',').filter(e => e.length > 0))
		if (this.isDeleteCabecera && keys.length > 0) keys = keys.filter((e, i) => i > 0)

		keys.forEach(e => {
			if (e.length > 0) {
				let group = e[0]
				for (let i = 1; i < e.length; i++) tableKeys.push({ idGroup: group, key: e[i], index: i })
			}
		})
		localStorage.setItem('keysListOficial', JSON.stringify(tableKeys))
		return tableKeys
	}
	//count keys per group
	countKeyperGroup() {
		let count: groupCount[] = []
		this.computeKeys().forEach(e => {
			let index = count.findIndex(f => f.group === e.idGroup)
			if (index < 0) count.push({ group: e.idGroup, total: 1 })
			else count[index].total++
		})
		if(count.length) localStorage.setItem('totalQuestions', JSON.stringify(count[0].total))
		return count
	}
	onLoadKeys(e: Event) {
		let a = (e.target as HTMLInputElement).files??[];
		if (a.length) {
			let file = a[0]
			let reader = new FileReader();
			reader.onload = () => {
				this.datastorageService.saveFileKeyAnswer(reader.result as string)
				this.claves = this.datastorageService.clearFile(reader.result as string)
			}
			reader.readAsText(file)
		}
	}
	ngOnInit(): void {

		let fileKeyAnswer = this.datastorageService.restoreFileKeyAnswer()
		this.claves = this.datastorageService.clearFile(fileKeyAnswer)

	}

}

interface groupCount { group: string, total: number }
