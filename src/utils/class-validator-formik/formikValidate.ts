import { transformAndValidateSync } from 'class-transformer-validator'
import { Class } from './types'
import { convertError } from './convertError'
import { trimObjectProperties } from './trim.util'

export function formikValidate(model: Class, data: any) {
  try {
    const trimmedData = trimObjectProperties(data)

    transformAndValidateSync(model, trimmedData)

    return {}
  } catch (e: any) {
    return convertError(e)
  }
}