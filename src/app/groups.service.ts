import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Group, Request, Message, User } from './types';
import { httpOptionsWithAuthToken } from './groups-list/httpOptionsWithAuthToken';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

	constructor(
		private http: HttpClient,
		private auth: AngularFireAuth,
	) { }

	private requestWithCredentials<T>(method: string, url: string, payload: any, defaultReturnValue: T): Observable<T> {
		return new Observable<T>(observer => {
			this.auth.user.subscribe(user => {
				user && user.getIdToken().then(token => {
					if (user && token) {
						if (method === 'get') {
							this.http.get<T>(url, httpOptionsWithAuthToken(token))
								.subscribe(data => observer.next(data));
						} else if (method === 'post') {
							this.http.post<T>(url, payload, httpOptionsWithAuthToken(token))
								.subscribe(data => observer.next(data));
						} else {
							observer.next(defaultReturnValue);
						}
					} else {
						observer.next(defaultReturnValue);
					}
				})
			})
		});
	}

	getCurrentUser(): Observable<User | null> {
		return new Observable<User | null>(observer => {
			this.auth.user.subscribe(user => {
				if (user) {
					observer.next({
						...user,
						fullName: 'Shaun',
					});
				} else {
					observer.next(null);
				}
			})
		});
	}

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
		return this.requestWithCredentials('post', `/api/groups/${groupId}/request`, {}, undefined);
	}

	createGroup(name: string): Observable<string> {
		return this.requestWithCredentials('post', `/api/groups`, { name }, '');
	}

	addMessage(groupId: string, text: string): Observable<Message[]> {
		return this.requestWithCredentials('post', `/api/groups/${groupId}/messages`, { text }, []);
	}

	acceptRequest(requestId: string): Observable<Request[]> {
		return this.requestWithCredentials<Request[]>('post', `/api/requests/${requestId}/accept`, {}, []);
	}

	rejectRequest(requestId: string): Observable<Request[]> {
		return this.requestWithCredentials<Request[]>('post', `/api/requests/${requestId}/reject`, {}, []);
	}

	getGroupById(groupId: string): Observable<Group | null> {
		return this.requestWithCredentials<Group | null>('get', `/api/groups/${groupId}`, {}, null);
	}

	getMessagesForGroup(groupId: string): Observable<Message[]> {
		return this.requestWithCredentials<Message[]>('get', `/api/groups/${groupId}/messages`, {}, []);
	}

	getRequestsForGroup(groupId: string): Observable<Request[]> {
		return this.requestWithCredentials<Request[]>('get', `/api/groups/${groupId}/requests`, {}, []);
	}

}
