import { Component, OnInit } from '@angular/core';
import { ICareerInfo, IExcelData, IStudentInfo } from "../../providersInterfaces";
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
	public referenceCareer: ICareerInfo[] = []
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
		private store: DatastorageService,
		private messageService: MessageService,
		private router: Router
	) {
		this.store.reLocationPage()
	} 
	evChangeHeader(headerName: string) {
		this.currentHeaderChange = headerName
	}
	evAsingHeader(newHeader: string){
		if (this.currentHeaderChange) {
			this.templateDataHeaderCustom[this.currentHeaderChange.toLocaleLowerCase()] = newHeader
			this.store.setTemplateDataHeaderCustom(this.templateDataHeaderCustom)
			this.currentHeaderChange = null
		}
	}
	computeTableStudent(): IStudentInfo[]{
		let data: IStudentInfo[] = []
		let templateGroups: Record<string, string> = {A: 'P', B: 'Q', C: 'R'}

		if (this.dataExcel.length > 0) {

			let tempHeaders: Record<string, string> = {...this.templateDataHeader, ...this.templateDataHeaderCustom}
	
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
					if (key == 'group' && findKey && student[findKey]) temporalPush[key] = templateGroups[temporalPush[key]?.toUpperCase()??""]?? 'N'
					if (index == 0) this.relationHeaders.push({ headerkey: key, relationkey: findKey})
				}

				if (true) {
					let indexCareer = this.referenceCareer.findIndex(x => this.store.normalizeString(x.careerName) == this.store.normalizeString(temporalPush.careerName??''))
					if (indexCareer > -1) {
						temporalPush.career = this.referenceCareer[indexCareer].career
						temporalPush.careername = this.referenceCareer[indexCareer].normalize
						temporalPush.group = this.referenceCareer[indexCareer].idGroup
						
					}
				}
				
				data.push({
					n: null,
					code: temporalPush.code,
					career: temporalPush.career,
					careerName: temporalPush.careerName,
					dni: temporalPush.dni,
					fullname: temporalPush.fullname,
					group: temporalPush.group,
					idBar: null,
					modality: temporalPush.modality??"SIN MODALIDAD",
					score: 0,
					calification: 0,
					merith: null
				 })
			})
			
		}
		let isModalitydataNull = data.every(x => x.modality == null );
		if (isModalitydataNull) data.forEach(x => {x.modality = "SIN MODALIDAD" })
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
				this.store.saveFileStudentInfo(this.dataExcel)
			}
			reader.readAsBinaryString(excelFile);
		}
		
	}
	async ngOnInit() {
		this.referenceCareer = await this.store.getCareers()
		this.dataExcel = await this.store.restoreFileStudentInfo()
	

		
		console.log(JSON.stringify(this.referenceCareer.map(x => {return {...x, normalize: x.careerName.toUpperCase()}})));
		
		this.templateDataHeaderCustom = await this.store.getTemplateDataHeaderCustom() //JSON.parse(localStorage.getItem('templateDataHeaderCustom')??'{}') as Record<string, string>;
	}
	nextStep(){
		this.store.getStudentInfoList().then(data => {
			if (data.length > 0) this.router.navigate(['/step3'])
			else this.messageService.add({ severity: 'warn', detail: 'No se han salvado los datos de los estudiantes' })	
		})
	}
	saveData(){
		let data = this.computeTableStudent()
		if (data.length > 0) {

			this.store.setStudentInfoList(data)
			this.messageService.add({severity:'success', detail:'Datos salvados correctamente'})
		}
		else this.messageService.add({severity:'warn', detail:'Cargar información de estudiantes antes de salvar'})
	}
	reset(){
		this.templateDataHeaderCustom = {}
		this.store.setTemplateDataHeaderCustom(this.templateDataHeaderCustom)
	}

}
