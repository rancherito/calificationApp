import { Component, OnInit } from '@angular/core';
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
  private dataHeaderTemplate: any = {
    career: "career",
    careername: "careername",
    code: "code",
    dni: "dni",
    fullname: "fullname",
    group: "group",
    modality: "modality"
  }

  private dataHeaderTemplateCustom: any = {}
  constructor() {} 
  computeTableStudent(): excelData[]{
    let data: excelData[] = []
    let templateGroups: any = {A: 'P', B: 'Q', C: 'R'}
    if (this.dataExcel.length > 0) {



      this.dataExcel.forEach((student, index) => {
        let keyss = Object.keys(student);

        let career = student[keyss.find(x => x.toLowerCase() == 'career') ?? ""] ?? null
        let careerName = student[keyss.find(x => x.toLowerCase() == 'careername') ?? ""] ?? null
        let code = student[keyss.find(x => x.toLowerCase() == 'code') ?? ""] ?? null
        let dni = student[keyss.find(x => x.toLowerCase() == 'dni') ?? ""] ?? null
        let fullname = student[keyss.find(x => x.toLowerCase() == 'fullname') ?? ""] ?? null
        let group = templateGroups[(student[keyss.find(x => x.toLowerCase() == 'group') ?? ""] as string)?.toUpperCase()] ?? null
        let modality = (student[keyss.find(x => x.toLowerCase() == 'modality') ?? ""] as string)?.toUpperCase() ?? null

        if (index == 0) {
          this.keyHeaders = keyss;
        }

        
        data.push({career,careerName,code,dni,fullname,group,modality})
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
        this.dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true });
        localStorage.setItem('student', JSON.stringify(this.dataExcel));
    
        //resolve(XLSX.utils.sheet_to_json(worksheet));
      }
      reader.readAsBinaryString(excelFile);
    }
    
  }
  ngOnInit(): void {
    let data = localStorage.getItem('student')
    if (data != null) {
      this.dataExcel = JSON.parse(data) as any[];
    }
      
    
  }

}
interface excelData{
  career: string | null,
  careerName: string| null,
  code: string| null,
  dni: string| null,
  fullname: string| null,
  group: string| null,
  modality: string| null
}
