import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RGPDController } from './RGPD.controller';
import { RGPDSchema } from './RGPD.schema';
import { RGPDService } from './RGPD.service';
import { UserModule } from '../user/user.module';
import { NotificationSchema } from '../notification/notification.schema';
import { SocketModule } from 'src/socketIO/socket.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register(),

    SocketModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: 'RGPD',
        schema: RGPDSchema,
      },
    ]),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
  ],
  providers: [
    RGPDService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [RGPDController],
  exports: [RGPDService],
})
export class RGPDModule {}
