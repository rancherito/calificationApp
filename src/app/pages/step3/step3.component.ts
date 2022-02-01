import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { IRelationCodeBar, IStudentInfo } from '../../providersInterfaces';

@Component({
	selector: 'page-step3',
	templateUrl: './step3.component.html',
	styleUrls: ['./step3.component.scss'],
	providers: [MessageService]
})
export class Step3Component implements OnInit {

	public data: IRelationCodeBar[] = []
	public dataLost: IRelationCodeBar[] = []
	public dataRelation: string[] = []
	public inasistenceList: IStudentInfo[] = []
	constructor(
		private datastorageService: DatastorageService,
		private router: Router,
		private message: MessageService
	) { }

	ngOnInit(): void {
		let fileRelation = this.datastorageService.restoreFileRelationCodeBar()
		this.dataRelation = this.datastorageService.clearFile(fileRelation)    
	}
	computeRelationKeys(){
		this.dataLost = []
		this.inasistenceList = []
		let studentInfo = this.datastorageService.getStudentInfoList()
		let relationcodebarList: IRelationCodeBar[] = []
		if (this.dataRelation.length > 1) {
			for (let i = 1; i < this.dataRelation.length; i++) {
				let [idBar, code] = this.dataRelation[i].split(',')
				relationcodebarList.push({idBar, code})
			}
			studentInfo.forEach(e => {
				let idbar = relationcodebarList.find(r => r.code == e.code)
				e.idBar = idbar?.idBar??null
				if(idbar == undefined) this.inasistenceList.push({...e})
			})
			relationcodebarList.forEach(e => {
				if (studentInfo.find(t => t.code == e.code) == undefined) this.dataLost.push({...e})
			})
		}
		return studentInfo
	}
	nextStep(){
		let studentData = this.datastorageService.getStudentInfoList()
		
		if (studentData.every(e => e.idBar == null)) {
			this.message.add({severity: "warn", detail: 'Primero salve los datos de los estudiantes'})
		}
		else this.router.navigate(['/step4'])
		
	}
	saveData(){
		this.datastorageService.setStudentInfoList(this.computeRelationKeys())
		this.message.add({ severity: "success", detail: 'Datos guardados' })
	}
	loadRelationsKeys(e: Event) {
			let target = e.target as HTMLInputElement;
			let files = target.files??[]
			if (files.length > 0) {
				let file = files[0]
				let reader = new FileReader()
				reader.onload = () => {
					if (reader.result) {
						this.datastorageService.saveFileRelationCodeBar(reader.result as string)
						this.dataRelation = this.datastorageService.clearFile(reader.result as string)
						
					}          
				}
				reader.readAsText(file)
			}
			
			
	}

}
