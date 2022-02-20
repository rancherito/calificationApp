export interface IExcelData {
    [code: string]: string | null,
    career: string | null,
    careerName: string | null,
    dni: string | null,
    fullname: string | null,
    group: string | null,
    modality: string | null
}
export interface IStudentInfo {
    n: number | null,
    merith: null | number,
    code: string | null,
    idBar: string | null,
    career: string | null,
    careerName: string | null,
    dni: string | null,
    fullname: string | null,
    group: string | null,
    modality: string,
    score: number, 
    calification: number
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
export interface IRelationCodeBar {
    idBar: string,
    code: string
}
export interface ICareer {
    career: string | null
    careerName: string | null
    totalStundets: number
}
export interface ICareerInfo {
    career: string 
    careerName: string
    idGroup: string
}