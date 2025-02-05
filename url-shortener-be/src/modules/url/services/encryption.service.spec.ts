import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let encryptionService: EncryptionService;

  beforeEach(() => {
    encryptionService = new EncryptionService();
  });

  it('should be defined', () => {
    expect(encryptionService).toBeDefined();
  });

  describe('encrypt and decrypt', () => {
    it('should correctly encrypt and decrypt a string', () => {
      const originalText = 'https://example.com';
      const encryptedText = encryptionService.encrypt(originalText);

      expect(encryptedText).not.toBe(originalText);

      const decryptedText = encryptionService.decrypt(encryptedText);

      expect(decryptedText).toBe(originalText);
    });
  });

  describe('decrypt with invalid data', () => {
    it('should throw an error when decrypting invalid data', () => {
      const invalidEncryptedText = 'invalid-text';

      expect(() =>
        encryptionService.decrypt(invalidEncryptedText),
      ).toThrowError();
    });
  });
});
