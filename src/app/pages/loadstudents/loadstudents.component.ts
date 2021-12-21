import { Component, OnInit } from '@angular/core';
import { IExcelData as excelData } from "../../providersInterfaces";
import * as XLSX from "xlsx";

@Component({
  selector: 'page-loadstudents',
  templateUrl: './loadstudents.component.html',
  styleUrls: ['./loadstudents.component.scss']
})
export class LoadstudentsComponent implements OnInit {
  public dataExcel: any[] = []
  public keyHeaders: string[] = []
  public dataHeaders: any = {
    career: "Carrera",
    careerName: "Nombre Carrera",
    code: "Codigo",
    dni: "DNI",
    fullname: "Nombres",
    group: "Grupo",
    modality: "Modalidad"
  }
  private templateDataHeader: any = {
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

  private templateDataHeaderCustom: any = {}
  constructor() {} 
  evChangeHeader(headerName: string) {
    this.currentHeaderChange = headerName
  }
  evAsingHeader(newHeader: string){
    if (this.currentHeaderChange) {
      this.templateDataHeaderCustom[this.currentHeaderChange.toLowerCase()] = newHeader
      let stringData = JSON.stringify(this.templateDataHeaderCustom)
      localStorage.setItem('templateDataHeaderCustom', stringData)
      this.currentHeaderChange = null
    }
  }
  computeTableStudent(): excelData[]{
    let data: excelData[] = []
    let templateGroups: any = {A: 'P', B: 'Q', C: 'R'}
    if (this.dataExcel.length > 0) {

      let tempHeaders: any = {...this.templateDataHeader, ...this.templateDataHeaderCustom}

      this.dataExcel.forEach((student, index) => {
        let keyss = Object.keys(student);
        let temporalPush: excelData = { career: null, careerName: null, code: null, dni: null, fullname: null, group: null, modality: null}

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


        
        data.push(temporalPush)
      })
      
    }
    let isModalitydataNull = data.every(x => x.modality == null );
    if (isModalitydataNull) data.forEach(x => {x.modality = "UNIQUE" })

    localStorage.setItem('studentDataOficial', JSON.stringify(data));
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
        this.dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true });
        localStorage.setItem('student', JSON.stringify(this.dataExcel));
    
        //resolve(XLSX.utils.sheet_to_json(worksheet));
      }
      reader.readAsBinaryString(excelFile);
    }
    
  }
  ngOnInit(): void {
    let data = localStorage.getItem('student')
    if (data != null) this.dataExcel = JSON.parse(data) as any[];
    
    let herdersCustom = localStorage.getItem('templateDataHeaderCustom')
    if (herdersCustom != null) this.templateDataHeaderCustom = JSON.parse(herdersCustom);
    
  }
  reset(){
    this.templateDataHeaderCustom = {}
    console.log(this.templateDataHeaderCustom );
    
    let stringData = JSON.stringify(this.templateDataHeaderCustom)
    localStorage.setItem('templateDataHeaderCustom', stringData)
  }

}
