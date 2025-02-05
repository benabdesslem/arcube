import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUrlQuery } from './get-url.query';
import { GetUrlResponseDto } from '../dtos/get-url-response.dto';
import { UrlService } from '../services/url.service';

@QueryHandler(GetUrlQuery)
export class GetUrlHandler implements IQueryHandler<GetUrlQuery> {
  constructor(private readonly urlService: UrlService) {}

  async execute(query: GetUrlQuery): Promise<GetUrlResponseDto> {
    return this.urlService.getUrl(query.shortId);
  }
}
