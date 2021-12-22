import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IKeyAnswer} from '../../providersInterfaces';
import { DatastorageService } from "../../datastorage/datastorage.service";
import { Router } from '@angular/router';
@Component({
	selector: 'page-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
	providers: [MessageService]
})
export class StartComponent implements OnInit {
	public claves: string[] = []
	public isDeleteCabecera = true;
	
	constructor(private datastorageService: DatastorageService, private messageService: MessageService, private router: Router) { }

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
	saveInformation(){
		let correct = false
		let count = this.countKeyperGroup()
		if (count.length > 0) {
			let referenceCount = count[0].total
			let averageTotal = count.reduce((ac, i) => ac + i.total,0) / count.length
			if (referenceCount == averageTotal) {
				this.datastorageService.setKeyAnswerList(this.computeKeys())
				this.datastorageService.setTotalKeys(averageTotal);
				this.messageService.add({ severity: 'success', detail: 'Lista de claves de respuesta guardados' });
			}
			else this.messageService.add({ severity: 'warn', detail: 'Asegure que los grupos tengan la misma cantidad de preguntan' });
		}
		else this.messageService.add({ severity: 'warn', detail: 'Asegurece de cargar los datos necesarios' });

		//
	}
	nextStep(){
		let data = this.datastorageService.getKeyAnswerList()
		console.log(data);
		
		if (data.length > 0) {
			this.router.navigate(['/loadstudents'])
		}
		else this.messageService.add({ severity: 'warn', detail: 'Primero guarde la información' });
	}

}

interface groupCount { group: string, total: number }
