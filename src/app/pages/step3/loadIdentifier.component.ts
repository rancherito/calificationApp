import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { IRelationCodeBar, IStudentInfo } from '../../providersInterfaces';

@Component({
	selector: 'page-loadIdentifier',
	templateUrl: './loadIdentifier.component.html',
	styleUrls: ['./loadIdentifier.component.scss'],
	providers: [MessageService]
})
export class loadIdentifier implements OnInit {
	private regValidate4Columns = new RegExp(/^\w+,\w+,\w+,\w+$/gi)
	private regValidate2Columns = new RegExp(/^\w+,\w+$/gi)

	private regValidateExtendFile = new RegExp(/^\d+[a-z][ ]*\d+[ ]*\d[ ]*[a-z][ ]*\d+$/gi)
	public data: IRelationCodeBar[] = []
	public dataLost: IRelationCodeBar[] = []
	public dataRelation: IRelationCodeBar[] = []
	public studentsValid: IRelationCodeBar[] = []

	public inasistenceList: IStudentInfo[] = []
	public file: string = ''
	public repeatedCode: IRelationCodeBar[] = []
	public studentInfo: IStudentInfo[] = [];
	constructor(
		private datastorageService: DatastorageService,
		private router: Router,
		private message: MessageService
	) { }

	private prepareFileStudentIdentifier(file: string) {
		let listIdentifier: IRelationCodeBar[] = []

		var clean = UtilsService.clearFile(file)
		if (clean.length < 1) return listIdentifier


		if (this.regValidate4Columns.test(clean[0])) {


			for (let i = 1; i < clean.length; i++) {
				let arrayInfo = clean[i].split(",")
				const idBar = ((parseInt(arrayInfo.join("").substring(0, 5)) + 1000000) + '').substring(1)
				const code = arrayInfo.join("").substring(5, 12)
				listIdentifier.push({ idBar, code })
			}
		}
		else if (this.regValidate2Columns.test(clean[0])) {
			for (let i = 1; i < clean.length; i++) {
				const [idBar, code] = clean[i].split(',')
				listIdentifier.push({ idBar, code })
			}
		}
		else if (this.regValidateExtendFile.test(clean[0])) {

			for (let index = 0; index < clean.length; index++) {
				const row = clean[index].split(' ');
				const code = row[4].substring(6, 13)
				const idBar = row[4].substring(0, 6)
				const printerCode = parseInt(row[0].substring(4, 9))
				listIdentifier.push({ idBar, code, printerCode })
			}
		}


		return listIdentifier
	}
	async loadingData() {
		this.dataRelation = await this.datastorageService.restoreFileRelationCodeBar()
		this.repeatedCode = []
		var students = (await this._computeRelationKeys())//.filter(x => x.idBar != null).sort((a, b) => parseInt(a.code ?? '0') - parseInt(b.idBar ?? '0'))

		this.dataRelation = this.dataRelation.map(e => {
			return {
				idBar: e.idBar,
				code: e.code,
				fullname: students.find(s => s.code == e.code)?.fullname,
				printerCode: e.printerCode
			}
		})
		//group by code using reduce
		let grouping: Map<string, IRelationCodeBar[]> = new Map()
		
		this.dataRelation.forEach(e => {
			if (grouping.has(e.code)) {
				grouping.get(e.code)?.push(e)
			}
			else grouping.set(e.code, [e])
		})

		grouping.forEach((value, key) => {
			if (value.length > 1) {
				this.repeatedCode.push(...value)
			}
		})
		
		this.studentsValid = this.dataRelation.filter(e => e.fullname && this.repeatedCode.every(x => x.code != e.code))
	}
	ngOnInit() {
		this.loadingData()
	}
	async _computeRelationKeys() {
		this.dataLost = []
		this.inasistenceList = []
		this.repeatedCode = []
		this.studentInfo = await this.datastorageService.getStudentInfoList()
		if (this.dataRelation.length > 0) {

			/*
						this.dataRelation.reduce((acc, cur) => {
							let i = acc.findIndex(x => x.code == cur.code)
							if (i >= 0) {
								this.repeatedCode.push(cur)
								if (this.repeatedCode.findIndex(x => x.idBar == acc[i].idBar) == -1) this.repeatedCode.push(acc[i])
								return acc
							}
							else {
								acc.push(cur)
								return acc
							}
						}, [] as IRelationCodeBar[])*/


			this.studentInfo.forEach(e => {
				let idbar = this.dataRelation.find(r => r.code == e.code)
				e.idBar = idbar?.idBar ?? null
				if (idbar == undefined) this.inasistenceList.push({ ...e })
			})

			this.dataRelation.forEach(e => {
				if (this.studentInfo.find(t => t.code == e.code) == undefined) this.dataLost.push({ ...e })
			})
		}

		return this.studentInfo
	}
	nextStep() {
		this.datastorageService.getStudentInfoList().then(studentData => {
			if (studentData.every(e => e.idBar == null)) {
				this.message.add({ severity: "warn", detail: 'Primero salve los datos de los estudiantes' })
			}
			else this.router.navigate(['/loadkeys'])
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
					this.file = reader.result as string
					const prepare = this.prepareFileStudentIdentifier(reader.result as string)

					this.datastorageService.saveFileRelationCodeBar(prepare)
					this.loadingData()
				}
			}
			reader.readAsText(file)
		}
	}
}
