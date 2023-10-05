import { TextFieldProps } from "@mui/material"
import { FormikProps, FormikErrors } from "formik"
import _ from 'lodash'
import { CreateUser, UpdateUser } from '../validations/basic/user.dto'

interface CreateUserFormikErrors extends Omit<FormikErrors<CreateUser>, "password"> {
  password?: string;
}

type FormikErrorsType = FormikErrors<CreateUser | UpdateUser> & CreateUserFormikErrors

export const getFormikProps = (formik: FormikProps<any>, property: string, mode?: string): TextFieldProps => {
  const touched = _.get(formik.touched, property)
  const errors = _.get(formik.errors as FormikErrorsType, property)
  const value = formik.values[property]

  return {
    name: property,
    error: touched && Boolean(errors),
    helperText: touched && errors as any,
    disabled: mode === 'READ',
    onChange: formik.handleChange(property),
    value: value,
    onBlur: formik.handleBlur(property)
  }
}