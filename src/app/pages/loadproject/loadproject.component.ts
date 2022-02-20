import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { DatastorageService, IProject } from 'src/app/datastorage/datastorage.service';
import { addDoc, collection, doc, DocumentData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { getDocs } from 'firebase/firestore';
//import {addDoc, collection, Firestore} from 'firebase/firestore';
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
		private route: Router,
		private firestore: Firestore
	) {
		this.storage.getProjects().then(projects => {
			this.projects = projects.sort((a, b) => b.createdDate - a.createdDate);
		})
	 }
	

	ngOnInit(): void {
		
		
		
	}
	
	saveProject(){
		if (this.newProject != null) {
			let project: IProject = {
				createdDate: new Date().getTime(),
				name: this.newProject,
				uuid: Guid.create().toString(),
				fileKeysHeader: true,
				fileKeysRemoveFirstColumn: true
			}
			this.storage.saveProject(project);
			this.storage.getProjects().then(projects => {
				this.projects = projects.sort((a, b) => b.createdDate - a.createdDate);
				this.onNew = false;
			})
		}
		
	}
	setProject(project: IProject){
		
		this.storage.setCurrentProject(project);
		this.storage.getStudentInfoList().then(students => {
			if (students.every(x => x.calification == 0)) {
				this.route.navigate(['/loadkeys']);
			}
			else
				this.route.navigate(['/report']);
		})
		//
	}

}
