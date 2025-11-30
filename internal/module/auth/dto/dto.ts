import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  isNotEmpty,
} from "class-validator"

export class RegisterDTO {
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(10)
  @IsNotEmpty()
  role_id!: number

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be a valid international format",
  })
  phone!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password!: string

  // @IsString()
  // @IsNotEmpty()
  // @Matches(/^\d{6}$/, {
  //   message: "PIN must be exactly 6 digits",
  // })
  // pin!: string
}

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password!: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: any
  token?: string
  errors?: string[]
}