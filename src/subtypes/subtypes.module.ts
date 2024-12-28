import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subtype, SubtypeSchema } from 'src/schemas/Subtype.schema';
import { SubtypesService } from './subtypes.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subtype.name, schema: SubtypeSchema }]),
  ],
  providers: [SubtypesService],
  controllers: [],
  exports: [SubtypesService],
})
export class SubtypesModule {}
