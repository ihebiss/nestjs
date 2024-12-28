import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subtype } from 'src/schemas/Subtype.schema';

@Injectable()
export class SubtypesService {
  constructor(@InjectModel(Subtype.name) private readonly subtypeModel: Model<Subtype>) {}

  async findByIds(ids: string[]): Promise<Subtype[]> {
    return this.subtypeModel.find({ _id: { $in: ids } }).exec();
  }

  async findOne(id: string): Promise<Subtype> {
    const subtype = await this.subtypeModel.findById(id).exec();
    if (!subtype) {
      throw new NotFoundException('Subtype not found');
    }
    return subtype;
  }
}
