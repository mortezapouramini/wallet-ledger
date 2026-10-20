export interface NewUser {
  name: string;
  email: string;
  password: string;
}

export interface NewUserRecord {
  name: string;
  email: string;
  passwordHash: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
