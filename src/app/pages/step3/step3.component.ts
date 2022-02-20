import { ThisReceiver } from '@angular/compiler';
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
	public file: string = ''
	public relationKeys: IStudentInfo[] = []
	public repeatedCode: IRelationCodeBar[] = []
	constructor(
		private datastorageService: DatastorageService,
		private router: Router,
		private message: MessageService
	) { }

	async loadingData(){
		this.file = (await this.datastorageService.restoreFileRelationCodeBar()) ?? ''
		this.dataRelation = this.datastorageService.clearFile(this.file)
		this.relationKeys = (await this._computeRelationKeys()).filter(x => x.idBar != null).sort((a, b) => parseInt(a.code ?? '0') - parseInt(b.idBar ?? '0'))
		

	}
	ngOnInit() {
		this.loadingData()
	}
	async _computeRelationKeys() {
		this.dataLost = []
		this.inasistenceList = []
		this.repeatedCode = []
		let studentInfo = await this.datastorageService.getStudentInfoList()
		let relationcodebarList: IRelationCodeBar[] = []
		if (this.dataRelation.length > 1) {
			for (let i = 1; i < this.dataRelation.length; i++) {
				let [idBar, code] = this.dataRelation[i].split(',')
				relationcodebarList.push({ idBar, code })
			}

			relationcodebarList.reduce((acc, cur) => {
				let i = acc.findIndex(x => x.code == cur.code)
				if (i >= 0) {
					this.repeatedCode.push(cur)
					if(this.repeatedCode.findIndex(x => x.idBar == acc[i].idBar) == -1) this.repeatedCode.push(acc[i])
					return acc
				}
				else {
					acc.push(cur)
					return acc
				}
			}, [] as IRelationCodeBar[])


			studentInfo.forEach(e => {
				let idbar = relationcodebarList.find(r => r.code == e.code)
				e.idBar = idbar?.idBar ?? null
				if (idbar == undefined) this.inasistenceList.push({ ...e })
			})
			relationcodebarList.forEach(e => {
				if (studentInfo.find(t => t.code == e.code) == undefined) this.dataLost.push({ ...e })
			})
		}
		console.log(this.repeatedCode);
		
		return studentInfo
	}
	nextStep() {
		this.datastorageService.getStudentInfoList().then(studentData => {
			if (studentData.every(e => e.idBar == null)) {
				this.message.add({ severity: "warn", detail: 'Primero salve los datos de los estudiantes' })
			}
			else this.router.navigate(['/step4'])
		})

	}
	saveData() {
		this._computeRelationKeys().then(e => {
			this.datastorageService.setStudentInfoList(e)
			this.message.add({ severity: "success", detail: 'Datos guardados' })
		})

	}
	loadRelationsKeys(e: Event) {
		let target = e.target as HTMLInputElement;
		let files = target.files ?? []
		if (files.length > 0) {
			let file = files[0]
			let reader = new FileReader()
			reader.onload = () => {
				if (reader.result) {
					this.datastorageService.saveFileRelationCodeBar(reader.result as string)
					/*this.file = (reader.result as string) ?? ''
					this.dataRelation = this.datastorageService.clearFile(this.file)
					this._computeRelationKeys().then(e => {
						this.relationKeys = e.filter(x => x.idBar != null).sort((a, b) => parseInt(a.idBar ?? '0') - parseInt(b.idBar ?? '0'))
					})*/
					this.loadingData()
				}
			}
			reader.readAsText(file)
		}


	}

}
