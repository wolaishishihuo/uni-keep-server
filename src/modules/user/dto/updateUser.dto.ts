import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsUUID, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { BaseUserInfoDto } from './baseUserInfo.dto';

export class UpdateUserDto extends BaseUserInfoDto {
  @ApiProperty({
    description: '用户ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsUUID('4', { message: '用户ID格式不正确' })
  @IsNotEmpty({ message: '用户ID不能为空' })
  id: string;

  @ApiProperty({
    description: '用户头像URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: '请输入有效的头像URL' })
  @MaxLength(255, { message: '头像URL最多255个字符' })
  avatar?: string;

  @ApiProperty({
    description: '邀请码',
    example: 'INVITE123',
    required: false,
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: '邀请码至少6位' })
  @MaxLength(20, { message: '邀请码最多20位' })
  @Matches(/^[A-Z0-9]+$/, { message: '邀请码只能包含大写字母和数字' })
  inviteCode?: string;

  @ApiProperty({
    description: '情侣ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: '情侣ID格式不正确' })
  coupleId?: string;
}
