import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'chamon8' })
  name: string;
  @IsString()
  @ApiProperty({ example: 'sheikhchamon8@gmail.com' })
  email: string;
  @MinLength(6)
  @ApiProperty()
  @ApiProperty({ example: 'chamonali8' })
  password: string;
}
