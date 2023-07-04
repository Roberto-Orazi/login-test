export const trimObjectProperties = (values: any): any => {
  Object.keys(values).forEach((key) => {
    if (key !== 'password' && key !== 'repeatPassword') {
      if (isObj(values[key])) {
        values[key] = trimObjectProperties(values[key])
      } else if (typeof values[key] === 'string') {
        values[key] = values[key].trim()
      }
    }
  })
  return values
}

const isObj = (obj: any): boolean => typeof obj === 'object' && obj !== null