import { Injectable } from '@nestjs/common';
import {
  UrlActivity,
  UrlActivityDocument,
} from '../schemas/url-activity.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class UrlActivityRepository {
  constructor(
    @InjectModel(UrlActivity.name)
    private readonly urlActivityModel: Model<UrlActivityDocument>,
  ) {}

  async save(url: UrlActivity, session?: ClientSession): Promise<UrlActivity> {
    return new this.urlActivityModel(url).save({ session });
  }
}
