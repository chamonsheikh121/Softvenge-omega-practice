import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class forgetPassDto {
  @IsString()
  @ApiProperty({ example: 'sheikhchamon8@gmail.com' })
  email: string;
}
