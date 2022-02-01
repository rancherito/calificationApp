import { Component, OnInit } from '@angular/core';
import { DatastorageService } from 'src/app/datastorage/datastorage.service';

@Component({
  selector: 'page-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(
    private storage: DatastorageService
  ) { }

  ngOnInit(): void {
    
    let stidentInfo = this.storage.getStudentInfoList().filter(x => x.idBar != null);
    stidentInfo.reduce((ac, i) => {
      let index = ac.findIndex(x => x.carrer == i.career);
      if (index > -1) {
        
      }
      else ac.push({
        carrer: i.career,
        totalStundets: 0,
        careerName: i.careerName,
      });
      return ac;
    }, [] as ICareer[])
    
  }

}

interface ICareer{
  carrer: string | null
  careerName: string | null
  totalStundets: number 
}