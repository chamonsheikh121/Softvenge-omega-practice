import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'The email of the user to verify',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The OTP sent to the user email',
    example: '123456',
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  @IsNotEmpty()
  otp: string;
}
