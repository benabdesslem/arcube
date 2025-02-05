import { IQuery } from '@nestjs/cqrs';

export class GetUrlQuery implements IQuery {
  constructor(public readonly shortId: string) {}
}
