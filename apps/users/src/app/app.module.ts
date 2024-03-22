import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FitUserModule } from './fit-user/fit-user.module';

@Module({
  imports: [AuthModule, FitUserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
