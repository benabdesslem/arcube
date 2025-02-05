import { ICommand } from '@nestjs/cqrs';

export class ShortenUrlCommand implements ICommand {
  constructor(public readonly originalUrl: string) {}
}
