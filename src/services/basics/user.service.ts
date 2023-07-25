import API, { AxiosConfig } from '../../config/axios.config'
import { User } from '../../types/types'
import {CreateUser, UpdateUser } from '../../validations/basic/user.dto'

const adminResourcePath = 'http://localhost:5005/users'
type Resource = User

const create = async (dto: CreateUser):Promise<Resource> =>{
  const res = await API.post<Resource>(adminResourcePath, dto, await AxiosConfig())
  return res.data
}

const update = async (dto: UpdateUser): Promise<Resource> => {
  const res = await API.put<Resource>(adminResourcePath, dto, await AxiosConfig())
  return res.data
}

const deleteUser = async (id: string): Promise<void> => {
  await API.delete(`${adminResourcePath}/${id}`, AxiosConfig())
}

const list = async (): Promise<Resource[]> => {
  const res = await API.get<Resource[]>(adminResourcePath, AxiosConfig())
  return res.data
}

export const UserService = {
  create,
  update,
  deleteUser,
  list
}


