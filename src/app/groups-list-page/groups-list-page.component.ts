import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../groups.service';
import { Group } from '../types';

@Component({
  selector: 'app-groups-list-page',
  templateUrl: './groups-list-page.component.html',
  styleUrls: ['./groups-list-page.component.css']
})
export class GroupsListPageComponent implements OnInit {
	isLoadingAllGroups = true;
	isLoadingUserGroups = true;
	isLoading = true;

	allGroups: Group[] = [];
	userGroups: Group[] = [];
	notUserGroups: Group[] = [];

	constructor(
		private groupsService: GroupsService,
	) { }

	calculateNonUserGroups() {
		this.notUserGroups = this.allGroups.filter(group => this.userGroups.every(userGroup => userGroup.id !== group.id));
	}

	ngOnInit(): void {
		this.groupsService.getGroups()
			.subscribe(groups => {
				console.log('Loaded all groups')
				this.allGroups = groups;
				this.isLoadingAllGroups = false;

				if (!this.isLoadingUserGroups) {
					this.isLoading = false;
					this.calculateNonUserGroups();
				}
			});
		this.groupsService.getGroupsForUser()
			.subscribe(groups => {
				console.log('Loaded user groups');
				this.userGroups = groups;
				this.isLoadingUserGroups = false;

				if (!this.isLoadingAllGroups) {
					this.isLoading = false;
					this.calculateNonUserGroups();
				}
			});
	}

}
