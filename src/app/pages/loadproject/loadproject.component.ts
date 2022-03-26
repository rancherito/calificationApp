import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { MessageService } from 'primeng/api';
import { DatastorageService, IProject } from 'src/app/datastorage/datastorage.service';

//import {addDoc, collection, Firestore} from 'firebase/firestore';
@Component({
	selector: 'page-loadproject',
	templateUrl: './loadproject.component.html',
	styleUrls: ['./loadproject.component.scss'],
	providers: [MessageService]
})
export class LoadprojectComponent implements OnInit {
	public projects: IProject[] = [];
	public currentEditProject: IProject
	public onNew = 0
	public openCrud = false
	public listColor: Record<string, string> = { 'cepre': 'var(--cyan-700)', 'otros': '#a9a9a9', 'admision': 'var(--primary-color)' }
	public isModeOffLine = false;
	constructor(
		private storage: DatastorageService,
		private route: Router,
		private messageService: MessageService
	) {
		
		this.currentEditProject = {
			createdDate: new Date().getTime(),
			name: "Nuevo proyecto",
			uuid: Guid.create().toString(),
			fileKeysHeader: true,
			fileKeysRemoveFirstColumn: true,
			unidad: 'otros',
			minScore: 6
		}
	}
	forceLoadProjects(){
		this.storage.getProjects(true).then(projects => {
			this.projects = projects.sort((a, b) => b.createdDate - a.createdDate);
		})
	}
	newProject(){
		this.onNew = 1;
	}
	ngOnInit(): void {
		this.storage.isModeOffLine().subscribe(isModeOffLine => {
			this.isModeOffLine = isModeOffLine;
			console.log(isModeOffLine);
			
			this.storage.getProjects().then(projects => {
				console.log(projects);
				this.projects = projects.sort((a, b) => b.createdDate - a.createdDate);
			})
		})
	}
	changeMode(){
		this.storage.tooggleModeOffLine();
	}
	editProject(project: IProject){
		this.currentEditProject = {...project};
		this.openCrud = true;
		this.onNew = 2;
	}
	saveProject(){
		if (this.onNew == 1) this.currentEditProject.createdDate = new Date().getTime();
		
		this.storage.saveProject(this.currentEditProject);
		this.storage.getProjects().then(projects => {
			this.projects = projects.sort((a, b) => b.createdDate - a.createdDate);
			this.onNew = 0;
		})
	
		
	}
	setProject(project: IProject){
		
		this.storage.setCurrentProject(project);
		this.storage.getStudentInfoList().then(students => {
			if (students.every(x => x.calification == 0)) {
				this.route.navigate(['/loadstudents']);
			}
			else
				this.route.navigate(['/report']);
		}).catch(err => {
			this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
		})
		//
	}

}
