import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class loginUserDto {
  @IsString()
  @ApiProperty({ example: 'sheikhchamon8@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'chamonali8' })
  password: string;
}
