import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator'

export class LoginDto {
  @IsEmail(undefined, { message: 'Ingrese un email válido.' })
  email!: string
  @IsString()
  @IsNotEmpty({ message: 'Ingrese la contraseña.' })
  @Length(6, 30, { message: 'La contraseña debe tener entre 6 y 30 caracteres' })
  password!: string
}

export class LogoutDto {
  @IsString()
  token!: string // device token from expo
}