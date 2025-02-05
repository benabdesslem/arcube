import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { UrlRepository } from '../repositories/url.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Url } from '../schemas/url.schema';
import { UrlActivityRepository } from '../repositories/url-activity.repository';
import { EncryptionService } from './encryption.service';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: UrlRepository;
  let encryptionService: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: UrlRepository,
          useValue: {
            findByShortId: jest.fn(),
            save: jest.fn(),
            updateOne: jest.fn(),
            getClient: jest.fn().mockReturnValue({
              startSession: jest.fn().mockReturnValue({
                commitTransaction: jest.fn(),
                abortTransaction: jest.fn(),
                endSession: jest.fn(),
              }),
            }),
          },
        },
        {
          provide: UrlActivityRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: EncryptionService,
          useValue: new EncryptionService(),
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<UrlRepository>(UrlRepository);
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUrl', () => {
    it('should return the original URL for a valid shortId', async () => {
      const mockUrl = {
        shortId: 'abcde12345',
        originalUrl: encryptionService.encrypt('https://example.com'),
      } as Url;

      jest.spyOn(urlRepository, 'findByShortId').mockResolvedValue(mockUrl);

      const result = await service.getUrl('abcde12345');
      expect(result).toEqual({
        shortId: 'abcde12345',
        originalUrl: 'https://example.com',
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(urlRepository.findByShortId).toHaveBeenCalledWith('abcde12345');
    });

    it('should throw NotFoundException if shortId does not exist', async () => {
      jest.spyOn(urlRepository, 'findByShortId').mockResolvedValue(null);

      await expect(service.getUrl('nyyyjghh49')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if shortId is invalid', async () => {
      await expect(service.getUrl('$1yyjghh49')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('shortenUrl', () => {
    it('should return the shortened URL', async () => {
      const originalUrl = 'https://example.com';
      const encryptedUrl = encryptionService.encrypt(originalUrl);
      const shortId = 'abc123';
      jest
        .spyOn(urlRepository, 'save')
        .mockResolvedValue({ shortId, originalUrl: encryptedUrl } as Url);

      const result = await service.shortenUrl(originalUrl);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expect(result).toEqual({ shortId: expect.any(String) });
    });

    it('should throw BadRequestException if URL is invalid', async () => {
      const originalUrl = 'invalid-url//';

      await expect(service.shortenUrl(originalUrl)).rejects.toThrowError(
        new BadRequestException('Invalid URL format.'),
      );
    });
  });
});
