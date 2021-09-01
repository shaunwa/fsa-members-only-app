import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Group } from './types';
import { httpOptionsWithAuthToken } from './groups-list/httpOptionsWithAuthToken';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

	constructor(
		private http: HttpClient,
		private auth: AngularFireAuth,
	) { }

	getGroups(): Observable<Group[]> {
		return this.http.get<Group[]>('/api/groups');
	}

	getGroupsForUser(): Observable<Group[]> {
		return new Observable<Group[]>(observer => {
			this.auth.user.subscribe(user => {
				user && user.getIdToken().then(token => {
					if (user && token) {
						this.http.get<Group[]>(`/api/users/${user.uid}/groups`, httpOptionsWithAuthToken(token))
							.subscribe(groups => observer.next(groups));
					} else {
						observer.next([]);
					}
				})
			})
		});
	}

	requestToJoinGroup(groupId: string): Observable<void> {
		return new Observable<void>(observer => {
			this.auth.user.subscribe(user => {
				user && user.getIdToken().then(token => {
					if (user && token) {
						this.http.post(`/api/groups/${groupId}/request`, {}, httpOptionsWithAuthToken(token))
							.subscribe(() => observer.next());
					} else {
						observer.next();
					}
				})
			})
		});
	}

	createGroup(name: string): Observable<string> {
		return new Observable<string>(observer => {
			this.auth.user.subscribe(user => {
				user && user.getIdToken().then(token => {
					if (user && token) {
						this.http.post<string>(`/api/groups`, { name }, httpOptionsWithAuthToken(token))
							.subscribe(newGroupId => observer.next(newGroupId));
					} else {
						observer.next('');
					}
				})
			})
		});
	}
}
