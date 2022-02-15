import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { DatastorageService, IProject } from 'src/app/datastorage/datastorage.service';

@Component({
	selector: 'page-loadproject',
	templateUrl: './loadproject.component.html',
	styleUrls: ['./loadproject.component.scss']
})
export class LoadprojectComponent implements OnInit {
	public projects: IProject[] = [];
	public newProject = "Nuevo proyecto";
	public onNew = false
	constructor(
		private storage: DatastorageService,
		private route: Router
	) { }

	ngOnInit(): void {
		this.projects = this.storage.getProjects().sort((a, b) => b.createdDate - a.createdDate);
	}
	
	saveProject(){
		if (this.newProject != null) {
			let project: IProject = {
				createdDate: new Date().getTime(),
				name: this.newProject,
				uuid: Guid.create().toString()
			}
			this.storage.saveProject(project);
			this.projects = this.storage.getProjects().sort((a, b) => b.createdDate - a.createdDate);
			this.onNew = false;
		}
		
	}
	setProject(project: IProject){
		console.log(project);
		
		this.storage.setCurrentProject(project);
		this.route.navigate(['/loadkeys']);
	}

}
