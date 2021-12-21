export interface IExcelData {
    [code: string]: string | null,
    career: string | null,
    careerName: string | null,
    dni: string | null,
    fullname: string | null,
    group: string | null,
    modality: string | null
}
export interface IAnswer {
    idBar: string
    idTheme: string
    idQuestion: number
    answer: string | null
}
export interface IKeyAnswer {
    key: string,
    idGroup: string,
    index: number
}
export interface IData {
    idBar: string,
    idStudent: string
}