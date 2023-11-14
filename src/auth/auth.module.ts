import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/user/entities/user.entity';
import { LoggerService } from 'src/logger/logger.service';
import { JwtAccessStrategy } from './strategy/jwtAccess.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from './strategy/jwtRefresh.strategy';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LoggerService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
