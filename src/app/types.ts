export interface User {
	fullName: string,
}

export interface Group {
	id: string,
	name: string,
	owner: User,
	members: User[],
}