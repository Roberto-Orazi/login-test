import {
  IsEmail,
  IsOptional,
} from 'class-validator'

export class UpdateMyProfileDto {
  @IsOptional()
  @IsEmail(undefined, { message: 'Ingrese un email válido.' })
  email: string
}