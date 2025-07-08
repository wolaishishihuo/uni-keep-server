import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CompleteSetupDto } from './dto/completeSetup.dto';
import { UserResponseEntity } from './entitys/userResponse.entity';
import { getContinuousFastingDays, getFastingDays } from './user.utils';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录请求处理完成' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginParmas: UserLoginDto) {
    return await this.authService.login(loginParmas.code);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('info/:id')
  @ApiOperation({ summary: '根据用户id查询用户' })
  @ApiResponse({
    status: 200,
    description: 'The founded user.'
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<any> {
    const { fastingPlans, fastingRecords, ...user } = await this.userService.findById(id);
    return new UserResponseEntity({
      ...user,
      fastingDays: getFastingDays(fastingPlans),
      continuousFastingDays: getContinuousFastingDays(fastingRecords)
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({
    status: 200,
    description: 'The updated user.'
  })
  @HttpCode(HttpStatus.OK)
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('completeSetup')
  @ApiOperation({ summary: '完成用户设置' })
  @ApiResponse({
    status: 200,
    description: '完成用户设置'
  })
  completeSetup(@Body() completeSetupDto: CompleteSetupDto) {
    return this.userService.completeSetup(completeSetupDto);
  }
}
