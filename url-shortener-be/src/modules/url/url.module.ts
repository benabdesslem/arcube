import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schemas/url.schema';
import { UrlController } from './controllers/url.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ShortenUrlHandler } from './commands/shorten-url.handler';
import { GetUrlHandler } from './queries/get-url.handler';
import { UrlService } from './services/url.service';
import { UrlRepository } from './repositories/url.repository';
import { UrlActivity, UrlActivitySchema } from './schemas/url-activity.schema';
import { UrlActivityRepository } from './repositories/url-activity.repository';
import { EncryptionService } from './services/encryption.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Url.name, schema: UrlSchema },
      {
        name: UrlActivity.name,
        schema: UrlActivitySchema,
      },
    ]),
    CqrsModule,
  ],
  controllers: [UrlController],
  providers: [
    UrlRepository,
    UrlActivityRepository,
    UrlService,
    EncryptionService,
    ShortenUrlHandler,
    GetUrlHandler,
  ],
  exports: [
    UrlRepository,
    UrlActivityRepository,
    UrlService,
    EncryptionService,
  ],
})
export class UrlModule {}
