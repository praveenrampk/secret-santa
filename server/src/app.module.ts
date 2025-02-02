import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecretSantaModule } from './secret-santa/secret-santa.module';
import { GroupModule } from './group/group.module';
import { MemberModule } from './member/member.module';
import { WishListModule } from './wish-list/wish-list.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGODB_URL),
    SecretSantaModule,
    GroupModule,
    MemberModule,
    WishListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
