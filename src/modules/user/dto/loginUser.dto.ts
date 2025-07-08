import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    description: '微信临时登录凭证code',
    example: '081LhvlQ1CfJ3h0M8RnQ1eZ3lQ1LhvlI'
  })
  @IsString()
  @IsNotEmpty({ message: 'code不能为空' })
  code: string;
}
