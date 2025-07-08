import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FastingModule } from '../fasting/fasting-plan/fasting.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [FastingModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
