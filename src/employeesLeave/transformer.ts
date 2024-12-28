import { Types } from 'mongoose';

export function toObjectId(id: string | undefined): Types.ObjectId | undefined {
  return id && Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : undefined;
}
