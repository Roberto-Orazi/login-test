import { ICredentials } from '../types/types'

const key = 'credentials-admin'

export const setCredentials = (data: ICredentials): void => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getCredentials = (): ICredentials | undefined => {
  try {
    const stringified = localStorage.getItem(key)
    let credentials: ICredentials | undefined

    if (stringified) credentials = JSON.parse(stringified)
    if (!credentials) return undefined

    return credentials
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export const clearCredentials = (): void => {
  localStorage.removeItem(key)
}