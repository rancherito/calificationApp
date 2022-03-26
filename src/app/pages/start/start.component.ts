import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IKeyAnswer} from '../../providersInterfaces';
import { DatastorageService, IProject } from "../../datastorage/datastorage.service";
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils/utils.service';
@Component({
	selector: 'page-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
	providers: [MessageService]
})
export class LoadKeysComponent implements OnInit {
	public claves: string[] = []
	public isDropHeader = true;
	public isDropFirstColumn = true;
	public file: string = ""
	public currentProject: IProject | null = null;
	constructor(private store: DatastorageService, private messageService: MessageService, private router: Router) {
		this.store.getCurrentProject().subscribe(e => {
			
			if (e == null) this.router.navigate(['/'])
			else {
				this.currentProject = e
				this.isDropFirstColumn = e.fileKeysRemoveFirstColumn
				this.isDropHeader = e.fileKeysHeader
			}
		})
		this.store.restoreFileKeyAnswer().then(e => {
			
			console.log(e);
			
			
			this.file = e
			this.claves = UtilsService.clearFile(e)
		})
	 }
	dropHeader(){
		if (this.currentProject != null) {
			this.currentProject.fileKeysHeader = this.isDropHeader
			this.currentProject.fileKeysRemoveFirstColumn = this.isDropFirstColumn
			this.store.setCurrentProject(this.currentProject)
		}
		
	}
	validateResponseCode(e: string){
		let reponsesValid = ['A', 'B', 'C', 'D', 'E', 'F']
		return !reponsesValid.includes(e.toUpperCase())
	}
	computeKeys(): IKeyAnswer[]{
		let startCut = this.isDropFirstColumn ? 1 : 0
		let tableKeys: IKeyAnswer[] = []
		let keys = [...this.claves].map(e => e.split(',').filter((e, i) => e.length > 0 && i >= startCut))
		if (this.isDropHeader && keys.length > 0) keys = keys.filter((e, i) => i > 0)

		
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
		let count: IGroupCount[] = []
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
				this.store.saveFileKeyAnswer(reader.result as string)
				this.file = (reader.result as string)??''
				this.claves = UtilsService.clearFile(reader.result as string)
			}
			reader.readAsText(file)
		}
	}
	ngOnInit(): void {

		
	}
	saveInformation(){
		let correct = false
		let count = this.countKeyperGroup()
		if (count.length > 0) {
			let referenceCount = count[0].total
			let averageTotal = count.reduce((ac, i) => ac + i.total,0) / count.length
			if (referenceCount == averageTotal) {
				this.store.setKeyAnswerList(this.computeKeys())
				this.store.setAverageKeys(averageTotal);
				this.messageService.add({ severity: 'success', detail: 'Lista de claves de respuesta guardados' });
			}
			else this.messageService.add({ severity: 'warn', detail: 'Asegure que los grupos tengan la misma cantidad de preguntan' });
		}
		else this.messageService.add({ severity: 'warn', detail: 'Asegurece de cargar los datos necesarios' });

		//
	}
	nextStep(){
		this.store.getKeyAnswerList().then(e => {
			if (e.length > 0) this.router.navigate(['/loadAnswers'])
			else this.messageService.add({ severity: 'warn', detail: 'Primero guarde la información' });
		})
	}

}

interface IGroupCount { group: string, total: number }
