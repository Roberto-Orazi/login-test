/* eslint-disable @typescript-eslint/no-unused-vars */
const NOT_FOUND = 404
const UNAUTHORIZED = 401
const PRECONDITION_FAILED = 412
const BAD_REQUEST = 400

export interface ErrorData {
  message: string,
  code: string,
  httpStatus: number
}

export const errorsCatalogs = {
  EMAIL_OR_PASSWORD_INVALID: {
    message: 'Email o clave inválidos',
    code: 'EMAIL_OR_PASSWORD_INVALID',
    httpStatus: UNAUTHORIZED

  },
  USER_NOT_FOUND: {
    message: 'Usuario no encontrado',
    code: 'USER_NOT_FOUND',
    httpStatus: NOT_FOUND

  },
  USER_EMAIL_NOT_FOUND: {
    message: 'Usuario con email no encontrado',
    code: 'USER_EMAIL_NOT_FOUND',
    httpStatus: NOT_FOUND
  },
  NOT_AUTHENTICATED: {
    message: 'Usuario no ha iniciado sesion',
    code: 'NOT_AUTHENTICATED',
    httpStatus: UNAUTHORIZED
  },
}