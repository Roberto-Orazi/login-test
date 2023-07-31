import { atLeastOneCapitalLetter, atLeastOneNumber, validCharacters } from '../../utils/password.helper'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsUUID,
  Matches,
  IsOptional
} from 'class-validator'

export class CreateUser {
  @IsString()
  @IsNotEmpty({ message: 'Ingrese el nombre completo.' })
  fullName: string

  @IsEmail(undefined, { message: 'Ingrese un email válido.' })
  @IsNotEmpty({ message: 'Ingrese el mail.' })
  email: string

  @Length(6, 30, {message: 'Tiene que tener mas de 6 y menos de 30 caracteres'})
  @Matches(atLeastOneCapitalLetter, {message: 'Tiene que tener al menos una letra mayuscula'})
  @Matches(atLeastOneNumber, {message: 'Tiene que tener al menos un numero'})
  @Matches(validCharacters, {message: 'Tienen que ser caracteres validos'})
  password: string
}

export class UpdateUser {
  @IsUUID()
  id: string

  @IsOptional()
  @IsString()
  @Length(2, 50, {message: 'Tiene que tener mas de 2 y menos de 50 caracteres'})
  fullName?: string

  @IsOptional()
  @IsEmail(undefined, { message: 'Ingrese un email válido.' })
  email?: string
}