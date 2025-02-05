import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly encryptionKey =
    process.env.ENCRYPTION_KEY || 'ErYx^G5x2?g6cxs;(%6Gh&->Ad{qW6f4';
  private readonly ivLength = 16;
  private readonly algorithm = 'aes-256-cbc';

  encrypt(text: string): string {
    const iv = randomBytes(this.ivLength);
    const cipher = createCipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey),
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = createDecipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey),
      iv,
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
