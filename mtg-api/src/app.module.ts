import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './common/bcrypt/bcrypt.module';
import envConfig from './common/config/env-config';
import { PrismaModule } from './common/prisma/prisma.module';
import { ScyfallModule } from './gateways/scyfall.module';
import { CardDeckModule } from './modules/card-deck/card-deck.module';
import { CardsModule } from './modules/cards/cards.module';
import { DecksModule } from './modules/deck/deck.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    BcryptModule,
    CardsModule,
    DecksModule,
    CardDeckModule,
    ScyfallModule,
    ConfigModule.forRoot({ load: [envConfig], isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
