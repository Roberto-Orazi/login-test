import { Class } from './types'
import { formikValidate } from './formikValidate'

export const createValidator = (c: Class) => (data: any) => formikValidate(c, data)