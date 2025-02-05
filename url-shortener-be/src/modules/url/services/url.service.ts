import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UrlRepository } from '../repositories/url.repository';
import { Url } from '../schemas/url.schema';
import { GetUrlResponseDto } from '../dtos/get-url-response.dto';
import { UrlActivityRepository } from '../repositories/url-activity.repository';
import { UrlActivity } from '../schemas/url-activity.schema';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);
  private readonly urlRegex =
    /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?(\?[^\s]*)?(#[^\s]*)?$/;

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly urlActivityRepository: UrlActivityRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async getUrl(shortId: string): Promise<GetUrlResponseDto> {
    if (!this.isValidShortId(shortId)) {
      throw new BadRequestException(`URL /${shortId} is invalid.`);
    }

    const url = await this.urlRepository.findByShortId(shortId);

    if (!url) {
      throw new NotFoundException(`URL /${shortId} not found.`);
    }

    const urlActivity = {
      url: url,
      accessedAt: new Date(),
    } as UrlActivity;

    const session = this.urlRepository.getClient().startSession();
    await this.urlActivityRepository.save(urlActivity, session);

    await this.urlRepository.updateOne(
      { shortId },
      { lastVisited: urlActivity.accessedAt },
      session,
    );

    await session.endSession();

    const originalUrl = this.encryptionService.decrypt(url.originalUrl);

    return {
      shortId: url.shortId,
      originalUrl,
    };
  }

  async shortenUrl(originalUrl: string): Promise<{ shortId: string }> {
    if (!this.isValidUrl(originalUrl)) {
      this.logger.warn(`Invalid URL provided: ${originalUrl}`);
      throw new BadRequestException('Invalid URL format.');
    }

    const shortId = this.generateShortId(10);

    const encryptedUrl = this.encryptionService.encrypt(originalUrl);

    await this.urlRepository.save({
      shortId,
      originalUrl: encryptedUrl,
    } as Url);

    return { shortId: `${shortId}` };
  }

  private isValidUrl(url: string): boolean {
    return this.urlRegex.test(url);
  }

  private generateShortId(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';

    const randomBytesArray = randomBytes(length);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytesArray[i] % charactersLength;
      result += characters[randomIndex];
    }

    return result;
  }

  private isValidShortId(shortId: string): boolean {
    const shortIdRegex = /^[a-z0-9]{10}$/;
    return shortIdRegex.test(shortId);
  }
}
