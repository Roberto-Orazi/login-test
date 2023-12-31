import API, { AxiosConfig } from '../../config/axios.config'
import { Res } from '../../types/response.types'
import { ICredentials, User } from '../../types/types'
import {
  LoginDto,
} from '../../validations/basic/auth.dto'

export const delay = (ms: number) => new Promise(
  (resolve) => setTimeout(() => { resolve(undefined) }, ms)
)

const login = async (dto: LoginDto): Promise<ICredentials> => {
  await delay(1000)
  const res = await API.post<ICredentials>('/auth/login', dto)
  return res.data
}

const refreshUser = async (): Promise<Res<User>> => {
  const res = await API.get<Res<User>>('/auth/retrieve', AxiosConfig())
  return res.data
}

const logout = async (): Promise<void> => {
  await API.put('/auth/logout', {}, AxiosConfig())
}

const AuthService = {
  login,
  logout,
  refreshUser,
}

export default AuthService