import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Url, UrlDocument } from '../schemas/url.schema';

@Injectable()
export class UrlRepository {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
  ) {}

  async save(url: Url, session?: ClientSession): Promise<Url> {
    return new this.urlModel(url).save({ session });
  }

  async updateOne(
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
    session?: ClientSession,
  ): Promise<void> {
    await this.urlModel.updateOne(filter, update, { session }).exec();
  }

  async findByShortId(shortId: string): Promise<Url | null> {
    return this.urlModel.findOne({ shortId }).exec();
  }

  getClient() {
    return this.urlModel.db.getClient();
  }
}
