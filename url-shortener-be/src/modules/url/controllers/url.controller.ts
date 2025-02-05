import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ShortenUrlCommand } from '../commands/shorten-url.command';
import { GetUrlQuery } from '../queries/get-url.query';
import { GetUrlResponseDto } from '../dtos/get-url-response.dto';

@Controller('api/url')
export class UrlController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/shorten')
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiBody({ description: 'The URL to be shortened', type: String })
  @ApiResponse({
    status: 201,
    description: 'The URL was shortened successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid URL format' })
  async shortenUrl(@Body('url') url: string): Promise<{ shortId: string }> {
    return this.commandBus.execute(new ShortenUrlCommand(url));
  }

  @Get('/:shortId')
  @ApiOperation({ summary: 'Redirect to the original URL by its shortened ID' })
  @ApiParam({ name: 'shortId', description: 'The shortened URL ID' })
  @ApiResponse({ status: 200, description: 'Returns the original URL' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({ status: 400, description: 'Invalid shortId format' })
  async redirectUrl(
    @Param('shortId') shortId: string,
  ): Promise<GetUrlResponseDto> {
    return await this.queryBus.execute(new GetUrlQuery(shortId));
  }
}
