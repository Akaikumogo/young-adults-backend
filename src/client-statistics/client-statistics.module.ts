import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientStatisticsService } from './client-statistics.service';
import { ClientStatisticsController } from './client-statistics.controller';
import { ClientStatistics, ClientStatisticsSchema } from './schemas/client-statistics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientStatistics.name, schema: ClientStatisticsSchema },
    ]),
  ],
  controllers: [ClientStatisticsController],
  providers: [ClientStatisticsService],
  exports: [ClientStatisticsService],
})
export class ClientStatisticsModule {}
