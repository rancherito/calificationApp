import { Component, OnInit } from '@angular/core';
import { IExcelData, IStudentInfo } from "../../providersInterfaces";
import { DatastorageService } from "../../datastorage/datastorage.service";
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import * as XLSX from "xlsx";

@Component({
	selector: 'page-loadstudents',
	templateUrl: './loadstudents.component.html',
	styleUrls: ['./loadstudents.component.scss'],
	providers: [MessageService]
})
export class LoadstudentsComponent implements OnInit {
	public dataExcel: Record<string, string>[] = []
	public keyHeaders: string[] = []
	public dataHeaders: Record<string, string> = {
		career: "Carrera",
		careerName: "Nombre Carrera",
		code: "Codigo",
		dni: "DNI",
		fullname: "Nombres",
		group: "Grupo",
		modality: "Modalidad"
	}
	private templateDataHeader: Record<string, string> = {
		career: "career",
		careername: "careername",
		code: "code",
		dni: "dni",
		fullname: "fullname",
		group: "group",
		modality: "modality"
	}
	public currentHeaderChange: string | null = null

	public relationHeaders: {headerkey: string, relationkey: string | undefined}[] = []

	private templateDataHeaderCustom: Record<string, string> = {}

	constructor(
		private datastorageService: DatastorageService,
		private messageService: MessageService,
		private router: Router
	) {} 
	evChangeHeader(headerName: string) {
		this.currentHeaderChange = headerName
	}
	evAsingHeader(newHeader: string){
		if (this.currentHeaderChange) {
			this.templateDataHeaderCustom[this.currentHeaderChange.toLocaleLowerCase()] = newHeader
			localStorage.setItem('templateDataHeaderCustom', JSON.stringify(this.templateDataHeaderCustom))
			this.currentHeaderChange = null
		}
	}
	computeTableStudent(): IStudentInfo[]{
		let data: IStudentInfo[] = []
		let templateGroups: Record<string, string> = {A: 'P', B: 'Q', C: 'R'}
		if (this.dataExcel.length > 0) {

			let tempHeaders: Record<string, string> = {...this.templateDataHeader, ...this.templateDataHeaderCustom}
			console.log(tempHeaders);
			
			this.dataExcel.forEach((student, index) => {
				let keyss = Object.keys(student);
				let temporalPush: IExcelData = { career: null, careerName: null, code: null, dni: null, fullname: null, group: null, modality: null}

				if (index == 0) {
					this.keyHeaders = keyss;
					this.relationHeaders = []
				}
				for (const key in temporalPush) {
					let findKey = keyss.find(x => x.toLowerCase() == tempHeaders[key.toLowerCase()].toLowerCase())
					if (findKey) temporalPush[key] = student[findKey] ?? null
					if (key == 'group' && findKey && student[findKey]) temporalPush[key] = templateGroups[temporalPush[key]?.toUpperCase()??""]??null
					if (index == 0) this.relationHeaders.push({ headerkey: key, relationkey: findKey})
				}


				
				data.push({ 
					code: temporalPush.code,
					career: temporalPush.career,
					careerName: temporalPush.careerName,
					dni: temporalPush.dni,
					fullname: temporalPush.fullname,
					group: temporalPush.group,
					idBar: null,
					modality: temporalPush.modality,
					score: null,
					calification: null
				 })
			})
			
		}
		let isModalitydataNull = data.every(x => x.modality == null );
		if (isModalitydataNull) data.forEach(x => {x.modality = "UNIQUE" })
		return data
	}
	readExcel(e: Event) {
		let files =(e.target as HTMLInputElement).files??[]
		if(files.length>0){
			let excelFile = files[0];
			let reader = new FileReader();
			reader.onload = () => {        
				var workbook = XLSX.read(reader.result, { type: 'binary' });
				var first_sheet_name = workbook.SheetNames[0];
				this.dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]) as Record<string, string>[];
				this.datastorageService.saveFileStudentInfo(JSON.stringify(this.dataExcel))
			}
			reader.readAsBinaryString(excelFile);
		}
		
	}
	ngOnInit(): void {
		this.dataExcel = this.datastorageService.restoreFileStudentInfo()
		this.templateDataHeaderCustom = JSON.parse(localStorage.getItem('templateDataHeaderCustom')??'{}') as Record<string, string>;
	}
	nextStep(){
		/*let data = this.computeTableStudent()
		this.datastorageService.saveFileStudentInfo(JSON.stringify(data))
		this.router.navigate(['/students/loadstudents/step2'])*/
		if (this.datastorageService.getStudentInfoList().length > 0) this.router.navigate(['/step3'])
		else this.messageService.add({severity:'warn', detail:'No se han salvado los datos de los estudiantes'})	
	}
	saveData(){
		let data = this.computeTableStudent()
		if (data.length > 0) {

			this.datastorageService.setStudentInfoList(data)
			this.messageService.add({severity:'success', detail:'Datos salvados correctamente'})
		}
		else this.messageService.add({severity:'warn', detail:'Cargar información de estudiantes antes de salvar'})
	}
	reset(){
		this.templateDataHeaderCustom = {}
		localStorage.setItem('templateDataHeaderCustom', '{}')
	}

}
