import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsUUID
} from 'class-validator'

export class CreateUser {
  @IsString()
  @IsNotEmpty({ message: 'Ingrese el nombre completo.' })
  fullName: string

  @IsEmail(undefined, { message: 'Ingrese un email válido.' })
  @IsNotEmpty({ message: 'Ingrese el mail.' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Ingrese la contraseña.' })
  @Length(6, 30, { message: 'La contraseña debe tener entre 6 y 30 caracteres' })
  password: string
}

export class UpdateUser {
  @IsUUID()
  id: string

  @IsString()
  @IsNotEmpty({ message: 'Ingrese el nombre completo, No puede estar vacio.' })
  fullName: string

  @IsEmail(undefined, { message: 'Ingrese un email válido.' })
  @IsNotEmpty({ message: 'Ingrese el mail, No puede estar vacio' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Ingrese la contraseña, No puede estar vacio.' })
  @Length(6, 30, { message: 'La contraseña debe tener entre 6 y 30 caracteres' })
  password: string
}