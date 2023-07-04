import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { getCredentials } from '../utils/credentials.helper'


export const AxiosConfig = (): AxiosRequestConfig => {
  const credentials = getCredentials()
  if (!credentials) throw new Error('token expired')
  return {
    headers: {
      Authorization: `bearer ${credentials.token}`,
    },
  }
}

export const getAPIHeaders = (): AxiosRequestHeaders => {
  const credentials = getCredentials()
  if (!credentials) throw new Error('token expired')
  return {
    Authorization: `bearer ${credentials.token}`,
  }
}

export const tryGetAPIHeaders = (): AxiosRequestHeaders | undefined => {
  try {
    const res = getAPIHeaders()
    return res
  } catch (error) {
    return undefined
  }
}

const instance = axios.create({
  baseURL: '',
})

export default instance