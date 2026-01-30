import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacationsService } from './vacation.service';
import { VacationsController } from './vacation.controller';
import { Vacation, VacationSchema } from './schemas/vacation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vacation.name, schema: VacationSchema }]),
  ],
  controllers: [VacationsController],
  providers: [VacationsService],
  exports: [VacationsService],
})
export class VacationsModule {}

