import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  
})
export class StartComponent implements OnInit {
  public claves: string[] = []
  public isLoadKeys = false
  public isDeleteCabecera = true;
  
  computeKeys(): IKey[]{
    let tableKeys: IKey[] = []
    let keys = [...this.claves].map(e => e.split(',').filter(e => e.length > 0))
    if (this.isDeleteCabecera && keys.length > 0) keys = keys.filter((e, i) => i > 0)

    keys.forEach(e => {
      if (e.length > 0) {
        let group = e[0]
        for (let i = 1; i < e.length; i++) tableKeys.push({ group, key: e[i], index: i })
      }
    })
    return tableKeys
  }
  //count keys per group
  countKeyperGroup() {
    let count: groupCount[] = []
    this.computeKeys().forEach(e => {
      let index = count.findIndex(f => f.group === e.group)
      if (index < 0) count.push({ group: e.group, total: 1 })
      else count[index].total++
    })
    return count
  }
  async onLoadKeys(e: Event) {
    let a = (e.target as HTMLInputElement).files??[];
    if (a.length) {
      let data = await this.readFileStringAsync(a[0])
      localStorage.setItem('keys', JSON.stringify(data))
      this.claves = data
      this.isLoadKeys = true
    }
    
    
  }
  async readFileStringAsync(file: File){
    return new Promise<string[]>((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve((reader.result as string).split("\r\n").filter(e => e.length > 0))
      }
      reader.readAsText(file)
    })
  }
  ngOnInit(): void {
    let keysString = localStorage.getItem('keys')
    if (keysString != null) {
      this.claves = JSON.parse(keysString) as string[]
      this.isLoadKeys = true
    }
  }

}
interface IKey {
  key: string,
  group: string,
  index: number
}
interface groupCount { group: string, total: number }
