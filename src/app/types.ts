export interface User {
	uid: string,
	fullName: string,
}

export interface Group {
	id: string,
	name: string,
	ownerId: string,
	owner: User,
	members: User[],
}

export interface Message {
	userName: string,
	text: string,
}

export interface Request {
	id: string,
	userName: string,
	name: string,
	owner: User,
}