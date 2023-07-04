export interface ICredentials {
  token: string
  user: User
}

export interface User {
  email: string
  password: string
}