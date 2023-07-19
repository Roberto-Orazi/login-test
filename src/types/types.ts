export interface ICredentials {
  token: string
  user: User
}

export interface LoginDto {
  email: string
  password: string
}
export interface User {
  id: string
  fullName: string
  email: string
  password: string
}

export interface CreateUserDto {
  fullName: string
  email: string
  password: string
}

export interface UpdateUserDto {
  id: string
  fullName: string
  email: string
}