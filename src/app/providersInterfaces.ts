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
    modality: string
    score: number
    calification: number
    _b?: number
    _c?: number
    _n?: number
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
    totalStundents: number,
    asistence: number
}
export interface ICareerInfo {
    career: string 
    careerName: string
    idGroup: string,
    normalize: string,
    color: string,
}
export interface ICalification {
    code: string,
    fullname: string,
    score: number,
    calification: string,
    dni: string
}