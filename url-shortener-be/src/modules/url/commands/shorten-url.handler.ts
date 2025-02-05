import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ShortenUrlCommand } from './shorten-url.command';
import { UrlService } from '../services/url.service';

@CommandHandler(ShortenUrlCommand)
export class ShortenUrlHandler implements ICommandHandler<ShortenUrlCommand> {
  constructor(private readonly urlService: UrlService) {}

  async execute(command: ShortenUrlCommand): Promise<{ shortId: string }> {
    return this.urlService.shortenUrl(command.originalUrl);
  }
}
