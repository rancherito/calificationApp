import { Component, OnInit } from '@angular/core';
import { IData } from '../../providersInterfaces';

@Component({
  selector: 'page-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {

  public data: IData[] = []
  public studentInfo: any[] = []
  constructor() { }

  ngOnInit(): void {
    let data = localStorage.getItem("dataCodeBar")
    if (data) this.data = JSON.parse(data)
    
    let studentInfo = localStorage.getItem("student")
    if (studentInfo) this.studentInfo = JSON.parse(studentInfo) as any[]


    console.log(this.studentInfo);
    
  }
  findFullnameStudent(student: IData) {
    let studentInfo: any = this.studentInfo.find(x => x.CODE == student.idStudent)
    
    return studentInfo?.FULLNAME??""
  }
  loadIndenty(e: Event) {
      let target = e.target as HTMLInputElement;
      let files = target.files??[]
      if (files.length > 0) {
        let file = files[0]
        let reader = new FileReader()
        reader.onload = () => {
          let data = reader.result?.toString().split("\r\n").filter(x => x.length > 0)??[]
          if (data.length > 0) {
            this.data = []
            let [idbar,idStudent] = data[0].split(",")
            data.forEach((x, i) => {
              if (i > 0) this.data.push({idBar:x.split(",")[0],idStudent: x.split(",")[1]})
            })

            localStorage.setItem("dataCodeBar", JSON.stringify(this.data))
          }
            
          
        }
        reader.readAsText(file)
      }
      
      
  }

}
